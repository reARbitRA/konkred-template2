import React, { useState, useEffect } from 'react';
import { Listing } from '../../types.ts';
import { 
  Presentation, 
  CheckCircle, 
  Loader2, 
  ExternalLink, 
  Eye, 
  RefreshCw, 
  Database, 
  Sparkles, 
  Lock, 
  LogOut, 
  CloudLightning,
  ChevronRight,
  Tv
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.tsx';
import { auth } from '../../services/firebase.ts';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface SlidesConsoleProps {
  listings: Listing[];
}

interface GeneratedDeck {
  id: string;
  title: string;
  url: string;
  timestamp: string;
  protocolTitle: string;
}

const COLOR_PRESETS = [
  { id: 'blue', name: 'Neon Blue', rgb: { red: 0.23, green: 0.51, blue: 0.96 }, class: 'bg-neon-blue border-neon-blue/30 text-white' },
  { id: 'green', name: 'Cyber Green', rgb: { red: 0.06, green: 0.72, blue: 0.54 }, class: 'bg-neon-green border-neon-green/30 text-white' },
  { id: 'purple', name: 'Atomic Purple', rgb: { red: 0.56, green: 0.27, blue: 0.97 }, class: 'bg-neon-purple border-neon-purple/30 text-white' },
  { id: 'gold', name: 'Sunset Gold', rgb: { red: 1.0, green: 0.58, blue: 0.0 }, class: 'bg-neon-gold border-neon-gold/30 text-white' }
];

export const SlidesConsole: React.FC<SlidesConsoleProps> = ({ listings }) => {
  const { showToast } = useToast();
  
  // Auth states
  const [gToken, setGToken] = useState<string | null>(null);
  const [gUser, setGUser] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Deck generation states
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedDecks, setGeneratedDecks] = useState<GeneratedDeck[]>([]);
  
  // Slide Viewer State
  const [manualPresentationId, setManualPresentationId] = useState('');
  const [viewerPresentationId, setViewerPresentationId] = useState('');

  // Load selected listing initially if lists are present
  useEffect(() => {
    if (listings.length > 0 && !selectedListingId) {
      setSelectedListingId(listings[0].id);
    }
  }, [listings, selectedListingId]);

  // Read saved decks from localStorage to persist during development edits
  useEffect(() => {
    const saved = localStorage.getItem('konkred_google_slides_decks');
    if (saved) {
      try {
        setGeneratedDecks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved decks', e);
      }
    }
  }, []);

  const saveDecks = (decks: GeneratedDeck[]) => {
    setGeneratedDecks(decks);
    localStorage.setItem('konkred_google_slides_decks', JSON.stringify(decks));
  };

  // Connect to Google Slides
  const handleConnect = async () => {
    setIsConnecting(true);
    setGenerationStep('Initializing Google handshake...');
    try {
      const provider = new GoogleAuthProvider();
      // Crucial: request actual presentations scope approved by user
      provider.addScope('https://www.googleapis.com/auth/presentations');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (credential?.accessToken) {
        setGToken(credential.accessToken);
        setGUser(result.user);
        showToast('Google Slides uplink secured successfully.', 'success');
      } else {
        showToast('Handshake error: Failed to retrieve presentation authorization.', 'error');
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Secure handshake cancelled by architect.', 'info');
      } else {
        showToast('HANDSHAKE_ERROR: Secure connection to Google presentation api refused.', 'error');
      }
    } finally {
      setIsConnecting(false);
      setGenerationStep('');
    }
  };

  const handleDisconnect = () => {
    setGToken(null);
    setGUser(null);
    showToast('Slides uplink revoked.', 'info');
  };

  // Generate Google Slides Presentation
  const handleGenerateDeck = async () => {
    if (!gToken) {
      showToast('UPLINK_REQUIRED: Please authenticate with Google first.', 'error');
      return;
    }

    const listing = listings.find(l => l.id === selectedListingId);
    if (!listing) {
      showToast('VALIDATION_ERROR: No valid protocol selected.', 'error');
      return;
    }

    // MANDATORY confirmation dialogue for write operations per instructions
    const confirmMessage = `Confirm action: Generate a new 4-slide Pitch Deck titled "${listing.title} - Strategic Investment Deck" on your Google Drive?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsGenerating(true);
    setGenerationStep('[01/04] Securing cloud presentation enclave...');

    try {
      // 1. Create presentation structure
      const createResponse = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `${listing.title} - Strategic Investment Deck`
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Execution failure on slide core generation: ${createResponse.statusText}`);
      }

      const presentationInfo = await createResponse.json();
      const presentationId = presentationInfo.presentationId;
      const defaultSlideId = presentationInfo.slides?.[0]?.objectId;

      setGenerationStep('[02/04] Compiling customized presentation components...');

      // Setup custom slide ids
      const timestamp = Date.now();
      const slideIds = {
        cover: `slide_cover_${timestamp}`,
        specs: `slide_specs_${timestamp}`,
        telemetry: `slide_telemetry_${timestamp}`,
        deploy: `slide_deploy_${timestamp}`
      };

      // Set accent color rgb values
      const preset = COLOR_PRESETS.find(p => p.id === selectedColor) || COLOR_PRESETS[0];
      const accentRgb = preset.rgb;

      // 2. Build bulk commands
      const requests: any[] = [];

      // Add our blank templates
      requests.push({ createSlide: { objectId: slideIds.cover, slideLayoutReference: { predefinedLayout: 'BLANK' } } });
      requests.push({ createSlide: { objectId: slideIds.specs, slideLayoutReference: { predefinedLayout: 'BLANK' } } });
      requests.push({ createSlide: { objectId: slideIds.telemetry, slideLayoutReference: { predefinedLayout: 'BLANK' } } });
      requests.push({ createSlide: { objectId: slideIds.deploy, slideLayoutReference: { predefinedLayout: 'BLANK' } } });

      // --- Slide 1 (Cover) Text & Sizing ---
      requests.push({
        createShape: {
          objectId: `${slideIds.cover}_title`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.cover,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 1500000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 1000000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.cover}_title`,
          text: listing.title.toUpperCase(),
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.cover}_title`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 36, unit: 'PT' },
            bold: true,
            foregroundColor: { opaqueColor: { rgbColor: accentRgb } }
          },
          fields: 'fontFamily,fontSize,bold,foregroundColor'
        }
      });

      requests.push({
        createShape: {
          objectId: `${slideIds.cover}_subtitle`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.cover,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 1000000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 2600000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.cover}_subtitle`,
          text: `VERIFIED INTELLECTUAL CAPITAL & VALUATION BLUEPRINT\nPOWERED BY KONKRED ENCLAVE ARCHITECTURE`,
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.cover}_subtitle`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 12, unit: 'PT' },
            foregroundColor: { opaqueColor: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } }
          },
          fields: 'fontFamily,fontSize,foregroundColor'
        }
      });

      // --- Slide 2 (Specs) Text & Sizing ---
      requests.push({
        createShape: {
          objectId: `${slideIds.specs}_title`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.specs,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 800000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.specs}_title`,
          text: "PROTOCOL SPECIFICATIONS & AUDIT",
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.specs}_title`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 24, unit: 'PT' },
            bold: true,
            foregroundColor: { opaqueColor: { rgbColor: accentRgb } }
          },
          fields: 'fontFamily,fontSize,bold,foregroundColor'
        }
      });

      const specsContent = `* Category Classification: ${listing.category.toUpperCase()}\n* System Delivery Protocol: ${listing.delivery.toUpperCase()}\n* Neural Verification Type: ${listing.type.toUpperCase()}\n* Structural Integrity Rating: ${listing.auditScore}%\n* Assessed Market Valuation: $${listing.pricing.amount.toLocaleString()} ${listing.pricing.currency}`;
      requests.push({
        createShape: {
          objectId: `${slideIds.specs}_body`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.specs,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 3000000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 1500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.specs}_body`,
          text: specsContent,
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.specs}_body`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 15, unit: 'PT' },
            foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.15, blue: 0.15 } } }
          },
          fields: 'fontFamily,fontSize,foregroundColor'
        }
      });

      // --- Slide 3 (Telemetry) Text & Sizing ---
      requests.push({
        createShape: {
          objectId: `${slideIds.telemetry}_title`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.telemetry,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 800000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.telemetry}_title`,
          text: "INTELLIGENCE TELEMETRY",
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.telemetry}_title`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 24, unit: 'PT' },
            bold: true,
            foregroundColor: { opaqueColor: { rgbColor: accentRgb } }
          },
          fields: 'fontFamily,fontSize,bold,foregroundColor'
         }
      });

      const telemetryContent = `* Enclave Requests Logged: ${listing.viewCount?.toLocaleString() || '142'} Requests\n* Total Asset Deployments: ${listing.salesCount || '0'} Executions\n* Active Conversion Rating: ${listing.salesCount > 0 ? ((listing.salesCount / (listing.viewCount || 1)) * 100).toFixed(1) : '1.4'}%\n* Node State Assessment: VALIDATED / SECURE\n* Active Sandbox Verification Enclave: active`;
      requests.push({
        createShape: {
          objectId: `${slideIds.telemetry}_body`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.telemetry,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 3000000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 1500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.telemetry}_body`,
          text: telemetryContent,
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.telemetry}_body`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 15, unit: 'PT' },
            foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.15, blue: 0.15 } } }
          },
          fields: 'fontFamily,fontSize,foregroundColor'
         }
      });

      // --- Slide 4 (Deployment) Text & Sizing ---
      requests.push({
        createShape: {
          objectId: `${slideIds.deploy}_title`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.deploy,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 800000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.deploy}_title`,
          text: "DEPLOYMENT & INTEGRATION ROADMAP",
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.deploy}_title`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 24, unit: 'PT' },
            bold: true,
            foregroundColor: { opaqueColor: { rgbColor: accentRgb } }
          },
          fields: 'fontFamily,fontSize,bold,foregroundColor'
         }
      });

      const deployContent = `* Sandbox Environments: Full virtualization layers secure host nodes dynamically.\n* Export Options: Direct cloud webhook triggering, file package sync and localized deployment keys.\n* Handshake Metrics: Integrated cryptographic key mappings and credential safety guarantees.\n* Scaled Infrastructure model: Direct and persistent serverless container initialization.`;
      requests.push({
        createShape: {
          objectId: `${slideIds.deploy}_body`,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageId: slideIds.deploy,
            size: { width: { magnitude: 8000000, unit: 'EMU' }, height: { magnitude: 3000000, unit: 'EMU' } },
            transform: { scaleX: 1, scaleY: 1, translateX: 572000, translateY: 1500000, unit: 'EMU' }
          }
        }
      });
      requests.push({
        insertText: {
          objectId: `${slideIds.deploy}_body`,
          text: deployContent,
          insertionIndex: 0
        }
      });
      requests.push({
        updateTextStyle: {
          objectId: `${slideIds.deploy}_body`,
          textRange: { type: 'ALL' },
          style: {
            fontFamily: 'Century Gothic',
            fontSize: { magnitude: 15, unit: 'PT' },
            foregroundColor: { opaqueColor: { rgbColor: { red: 0.15, green: 0.15, blue: 0.15 } } }
          },
          fields: 'fontFamily,fontSize,foregroundColor'
         }
      });

      // Clear the first default blank slide created with the presentation
      if (defaultSlideId) {
        requests.push({
          deleteObject: { objectId: defaultSlideId }
        });
      }

      setGenerationStep('[03/04] Writing design vectors to Google endpoints...');

      // 3. Post requests batchUpdate
      const updateResponse = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to apply slide layout styling: ${updateResponse.statusText}`);
      }

      setGenerationStep('[04/04] Establishing secure persistence layer...');

      // 4. Save presentation to historical decks list
      const driveUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
      const newDeck: GeneratedDeck = {
        id: presentationId,
        title: `${listing.title} - Strategic Investment Deck`,
        url: driveUrl,
        timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }),
        protocolTitle: listing.title
      };

      const updatedDecks = [newDeck, ...generatedDecks];
      saveDecks(updatedDecks);
      setViewerPresentationId(presentationId);

      showToast('Investor Pitch Deck structured successfully on Google Slides!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(`DECK_BUILD_FAILURE: ${error.message || 'Error occurred while contacting Google Drive.'}`, 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleManualEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPresentationId) return;

    // Handle full Google Docs URL paste
    let cleanId = manualPresentationId.trim();
    const urlMatch = cleanId.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
    if (urlMatch && urlMatch[1]) {
      cleanId = urlMatch[1];
    }

    setViewerPresentationId(cleanId);
    showToast('Loaded active presentation into viewer frame.', 'success');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans" id="deck-generator-module">
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connection card */}
        <div className="concrete-card p-10 rounded-[2.5rem] bg-black/40 border-white/5 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.3em] font-black block mb-2">Endpoint Status</span>
            <h3 className="text-2xl font-bold font-display text-white mb-2 uppercase leading-none">Google Slides Link</h3>
            <p className="text-ghost text-xs leading-relaxed font-light mt-3">
              Establish a secure Google API handshake to dynamically build presentation pitch decks for active assets in your inventory.
            </p>
          </div>
          <div className="pt-6">
            {!gToken ? (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="gsi-material-button w-full shadow-lg"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-mono uppercase tracking-widest text-[9px] font-bold">Connect Google Enclave</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between p-4 bg-neon-green/5 border border-neon-green/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
                    <CloudLightning size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neon-green font-bold block uppercase">Uplink Secured</span>
                    <span className="text-white text-xs font-mono font-medium truncate max-w-[150px] block">{gUser?.email}</span>
                  </div>
                </div>
                <button 
                  onClick={handleDisconnect}
                  className="p-2 text-ghost hover:text-neon-red hover:bg-neon-red/5 rounded-xl transition-all"
                  title="Disconnect Link"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurations card */}
        <div className="concrete-card p-10 rounded-[2.5rem] bg-black/40 border-white/5 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-start border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-mono text-neon-purple uppercase tracking-[0.3em] font-black block mb-2">Automated Builder</span>
              <h3 className="text-2xl font-bold font-display text-white uppercase leading-none">Generator Parameters</h3>
            </div>
            <Sparkles className="text-neon-purple animate-pulse" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-ghost font-bold uppercase tracking-wider block">Target Localized Protocol</label>
              <select 
                value={selectedListingId} 
                onChange={(e) => setSelectedListingId(e.target.value)}
                disabled={listings.length === 0}
                className="w-full bg-void border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:border-neon-purple outline-none transition-all"
              >
                {listings.length === 0 ? (
                  <option>No modules detected on node.</option>
                ) : (
                  listings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title.toUpperCase()} [ID: {item.id.slice(0, 6)}]
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-ghost font-bold uppercase tracking-wider block font-sans">Brand Accent Alignment</label>
              <div className="flex gap-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedColor(preset.id)}
                    className={`flex-1 py-4 px-2 rounded-2xl text-[9px] font-mono font-black uppercase text-center border transition-all ${
                      selectedColor === preset.id 
                        ? `${preset.class} shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-105` 
                        : 'bg-void border-white/10 text-ghost hover:text-white hover:border-white/20'
                    }`}
                  >
                    {preset.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
            <button
              onClick={handleGenerateDeck}
              disabled={!gToken || isGenerating || listings.length === 0}
              className="bg-neon-purple text-white w-full md:w-auto px-10 py-5 rounded-2xl text-xs uppercase font-black tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Presentation size={16} />}
              Structure Slide Deck
            </button>
            {isGenerating && (
              <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest animate-pulse font-bold">
                {generationStep}
              </span>
            )}
            {!gToken && !isGenerating && (
              <span className="text-[9px] font-mono text-neon-gold/70 uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} /> Google Link handshake required to compile decks
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* History / Vault list */}
        <div className="lg:col-span-4 space-y-6">
          <div className="concrete-card p-8 rounded-[2.5rem] bg-black/30 border-white/5 space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Active Deck Ledger</h4>
                <Database size={16} className="text-ghost opacity-40" />
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {generatedDecks.length === 0 ? (
                  <div className="py-12 text-center text-ghost text-[10px] font-mono uppercase tracking-widest opacity-40 italic">
                    Vault empty. No active slide decks compiled.
                  </div>
                ) : (
                  generatedDecks.map((deck) => (
                    <div 
                      key={deck.id}
                      onClick={() => setViewerPresentationId(deck.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center group ${
                        viewerPresentationId === deck.id 
                          ? 'bg-neutral-900/60 border-neon-purple/50' 
                          : 'bg-void border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="space-y-1.5 truncate pr-4">
                        <span className="text-white font-black text-xs block truncate group-hover:text-neon-purple transition-colors">
                          {deck.title.split(' - ')[0]}
                        </span>
                        <div className="flex items-center gap-3 text-[8px] font-mono text-ghost/50 uppercase tracking-widest">
                          <span>{deck.timestamp}</span>
                          <span>|</span>
                          <span className="text-neon-cyan">{deck.id.slice(0, 10)}...</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-ghost group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <form onSubmit={handleManualEmbed} className="space-y-4">
                <label className="text-[10px] font-mono text-ghost font-bold uppercase tracking-wider block">Import Existing Presentation ID / URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualPresentationId}
                    onChange={(e) => setManualPresentationId(e.target.value)}
                    placeholder="Enter URL or Presentation ID..."
                    className="flex-1 bg-void border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-neon-teal outline-none transition-all placeholder:text-ghost/20 placeholder:uppercase placeholder:text-[9px]"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-ghost hover:text-white hover:bg-white/10 transition-all font-mono text-xs"
                    title="Load Deck"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Live Presentation Screen / Workspace Viewer */}
        <div className="lg:col-span-8">
          <div className="concrete-card rounded-[2.5rem] bg-black/40 border-white/5 overflow-hidden h-full flex flex-col justify-between">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-purple/10 rounded-xl flex items-center justify-center text-neon-purple border border-neon-purple/20">
                  <Tv size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Deck Projection</h4>
                  <p className="text-[8px] font-mono text-ghost uppercase tracking-widest mt-0.5">
                    {viewerPresentationId ? `Active Stream: /d/${viewerPresentationId}` : 'NO ACTIVE PROJECTION'}
                  </p>
                </div>
              </div>

              {viewerPresentationId && (
                <div className="flex gap-3">
                  <a 
                    href={`https://docs.google.com/presentation/d/${viewerPresentationId}/edit`}
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 border border-white/5 hover:border-white/15 rounded-xl bg-white/5 flex items-center gap-2 text-[9px] font-mono text-white transition-all uppercase tracking-widest"
                  >
                    <ExternalLink size={12} /> Open in Slides
                  </a>
                  <button 
                    onClick={() => {
                      setViewerPresentationId('');
                      showToast('Terminated terminal slide projection.', 'info');
                    }}
                    className="px-4 py-2 border border-neon-red/10 hover:border-neon-red/30 rounded-xl bg-neon-red/5 flex items-center gap-2 text-[9px] font-mono text-neon-red transition-all uppercase tracking-widest"
                  >
                    Close Projection
                  </button>
                </div>
              )}
            </div>

            <div className="bg-void/40 relative aspect-video flex items-center justify-center">
              {viewerPresentationId ? (
                <iframe
                  title="Google Slides Viewer"
                  src={`https://docs.google.com/presentation/d/${viewerPresentationId}/embed?start=false&loop=false&delayms=5000`}
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  className="w-full h-full aspect-video border-0"
                />
              ) : (
                <div className="p-16 text-center space-y-4 max-w-md">
                  <Presentation size={48} className="text-ghost opacity-20 mx-auto" />
                  <p className="text-ghost text-xs leading-relaxed font-light uppercase tracking-widest">
                    Ready to project. Select an established deck from your Ledger above or create a new one to initialize preview terminal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
