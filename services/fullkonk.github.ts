import { GeneratedFile } from '../types';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  message: string;
}

export interface GitHubExportResult {
  success: boolean;
  prUrl?: string;
  commitSha?: string;
  filesUploaded: number;
  errors: string[];
}

function toBase64(value: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(value, 'utf8').toString('base64');
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function encodePath(filePath: string): string {
  return filePath.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown GitHub error';
}

async function githubFetch(url: string, init: RequestInit, retries = 2): Promise<Response> {
  let response: Response | null = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    response = await fetch(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt < retries) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 300 * (2 ** attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  if (!response) throw new Error('GitHub did not return a response.');
  return response;
}

function headers(config: GitHubConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    'User-Agent': 'KONKRED-fullKONK',
  };
}

async function responseError(response: Response, fallback: string): Promise<string> {
  try {
    const payload = await response.json() as { message?: unknown };
    return typeof payload.message === 'string' ? payload.message : fallback;
  } catch {
    return fallback;
  }
}

async function ensureBranch(config: GitHubConfig): Promise<string> {
  const base = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  const repoResponse = await githubFetch(base, { headers: headers(config) });
  if (repoResponse.status === 404) throw new Error('Repository not found or the token cannot access it.');
  if (!repoResponse.ok) throw new Error(await responseError(repoResponse, 'Cannot access repository.'));
  const repoData = await repoResponse.json() as { default_branch?: string };
  const defaultBranch = repoData.default_branch || 'main';

  const refResponse = await githubFetch(`${base}/git/refs/heads/${encodeURIComponent(defaultBranch)}`, { headers: headers(config) });
  if (!refResponse.ok) throw new Error(await responseError(refResponse, `Cannot access default branch '${defaultBranch}'.`));
  const refData = await refResponse.json() as { object?: { sha?: string } };
  const sha = refData.object?.sha;
  if (!sha) throw new Error('GitHub returned an invalid default branch reference.');

  const branchResponse = await githubFetch(`${base}/git/refs/heads/${encodeURIComponent(config.branch)}`, { headers: headers(config) });
  if (branchResponse.status === 404) {
    const createResponse = await githubFetch(`${base}/git/refs`, {
      method: 'POST',
      headers: headers(config),
      body: JSON.stringify({ ref: `refs/heads/${config.branch}`, sha }),
    });
    if (!createResponse.ok) throw new Error(await responseError(createResponse, `Could not create branch '${config.branch}'.`));
  } else if (!branchResponse.ok) {
    throw new Error(await responseError(branchResponse, `Could not inspect branch '${config.branch}'.`));
  }
  return defaultBranch;
}

async function getFileSha(config: GitHubConfig, filePath: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(config.branch)}`;
  const response = await githubFetch(url, { headers: headers(config) });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(await responseError(response, `Could not inspect ${filePath}.`));
  const data = await response.json() as { sha?: string };
  return data.sha;
}

async function uploadFile(config: GitHubConfig, file: GeneratedFile): Promise<string | undefined> {
  const sha = await getFileSha(config, file.path);
  const body: Record<string, string> = {
    message: config.message,
    content: toBase64(file.content),
    branch: config.branch,
  };
  if (sha) body.sha = sha;
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodePath(file.path)}`;
  const response = await githubFetch(url, {
    method: 'PUT',
    headers: headers(config),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await responseError(response, `Failed to upload ${file.path}.`));
  const data = await response.json() as { commit?: { sha?: string } };
  return data.commit?.sha;
}

async function createPR(config: GitHubConfig, baseBranch: string): Promise<string> {
  if (config.branch === baseBranch || config.branch === 'main' && baseBranch === 'main') return '';
  const url = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/pulls`;
  const response = await githubFetch(url, {
    method: 'POST',
    headers: headers(config),
    body: JSON.stringify({
      title: `[fullKONK_>] ${config.message}`,
      head: config.branch,
      base: baseBranch,
      body: `Generated by fullKONK_> on konkred.xyz\n\n${config.message}`,
    }),
  });
  if (!response.ok) throw new Error(await responseError(response, 'Files uploaded, but pull request creation failed.'));
  const data = await response.json() as { html_url?: string };
  return data.html_url || '';
}

export async function exportToGitHub(files: GeneratedFile[], config: GitHubConfig): Promise<GitHubExportResult> {
  if (files.length === 0) return { success: false, filesUploaded: 0, errors: ['No files to export.'] };
  const errors: string[] = [];
  let filesUploaded = 0;
  let commitSha: string | undefined;
  let defaultBranch: string;
  try {
    defaultBranch = await ensureBranch(config);
  } catch (error) {
    return { success: false, filesUploaded: 0, errors: [errorMessage(error)] };
  }
  for (const file of files) {
    try {
      commitSha = await uploadFile(config, file) || commitSha;
      filesUploaded += 1;
    } catch (error) {
      errors.push(`${file.path}: ${errorMessage(error)}`);
    }
  }
  let prUrl: string | undefined;
  if (filesUploaded > 0 && config.branch !== defaultBranch) {
    try {
      prUrl = await createPR(config, defaultBranch) || undefined;
    } catch (error) {
      errors.push(errorMessage(error));
    }
  }
  return { success: filesUploaded > 0, filesUploaded, commitSha, prUrl, errors };
}
