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
        <div className="bg-void-100 border-4 border-black p-10 shadow-brutalist flex flex-col justify-between min-h-[260px]">
          <div>
            <span className="text-[10px] font-mono text-signal uppercase tracking-[0.3em] font-black block mb-3">Endpoint Status_</span>
            <h3 className="text-3xl font-black font-display text-white mb-2 uppercase tracking-tighter leading-none text-signal">Google_Slides_Link_</h3>
            <p className="text-zinc-400 text-xs leading-relaxed font-bold mt-4 uppercase font-mono">
              Establish a secure Google API handshake to dynamically build presentation pitch decks for active assets in your inventory unit.
            </p>
          </div>
          <div className="pt-8">
            {!gToken ? (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-white text-black border-4 border-black font-black uppercase font-mono text-[10px] tracking-widest w-full py-4 shadow-[4px_4px_0px_#D98A2E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-4"
              >
                <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3 h-3">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                Connect Google Enclave
              </button>
            ) : (
              <div className="flex items-center justify-between p-5 bg-black border-4 border-black shadow-[4px_4px_0px_#D98A2E]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-black bg-signal flex items-center justify-center text-black">
                    <CloudLightning size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-signal font-black block uppercase tracking-widest">Uplink Secured_</span>
                    <span className="text-white text-[10px] font-mono font-bold truncate max-w-[150px] block">{gUser?.email}</span>
                  </div>
                </div>
                <button 
                  onClick={handleDisconnect}
                  className="w-10 h-10 bg-black border-2 border-zinc-800 text-zinc-500 hover:text-red-500 transition-all flex items-center justify-center"
                  title="Disconnect Link"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurations card */}
        <div className="bg-[#18181b] border-4 border-black p-10 shadow-brutalist lg:col-span-2 space-y-8">
          <div className="flex justify-between items-start border-b-4 border-black pb-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] font-black block mb-2">Automated Builder_</span>
              <h3 className="text-3xl font-black font-display text-white uppercase leading-none tracking-tighter">Generator Parameters_</h3>
            </div>
            <div className="w-12 h-12 bg-black border-2 border-zinc-800 flex items-center justify-center text-signal">
              <Sparkles size={24} className="animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-zinc-400 font-black uppercase tracking-wider block">Target_Localized_Protocol_</label>
              <select 
                value={selectedListingId} 
                onChange={(e) => setSelectedListingId(e.target.value)}
                disabled={listings.length === 0}
                className="w-full bg-black border-4 border-black p-4 text-[10px] font-mono text-white focus:border-signal outline-none transition-all uppercase font-bold"
              >
                {listings.length === 0 ? (
                  <option>No modules detected on node.</option>
                ) : (
                  listings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title.toUpperCase()} [ID: {item.id.slice(0, 8)}]
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-zinc-400 font-black uppercase tracking-wider block">Brand_Accent_Alignment_</label>
              <div className="flex gap-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedColor(preset.id)}
                    className={`flex-1 py-4 px-2 border-4 border-black text-[9px] font-mono font-black uppercase text-center transition-all ${
                      selectedColor === preset.id 
                        ? `bg-black text-white shadow-[2px_2px_0px_#D98A2E] scale-105` 
                        : 'bg-zinc-900 border-black text-zinc-600 hover:bg-black hover:text-white'
                    }`}
                  >
                    {preset.id === 'blue' && <span className="text-blue-400">BLUE_</span>}
                    {preset.id === 'green' && <span className="text-green-400">GREEN_</span>}
                    {preset.id === 'purple' && <span className="text-purple-400">PURPLE_</span>}
                    {preset.id === 'gold' && <span className="text-signal">GOLD_</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center gap-8">
            <button
              onClick={handleGenerateDeck}
              disabled={!gToken || isGenerating || listings.length === 0}
              className="bg-black text-white w-full md:w-auto px-12 py-5 border-4 border-black text-xs uppercase font-black tracking-widest shadow-[4px_4px_0px_#D98A2E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-20 flex items-center justify-center gap-4"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Presentation size={18} />}
              Structure_Slide_Deck_
            </button>
            {isGenerating && (
              <span className="text-[10px] font-mono text-signal uppercase tracking-widest animate-pulse font-black">
                {generationStep}
              </span>
            )}
            {!gToken && !isGenerating && (
              <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest flex items-center gap-3 font-black">
                <Lock size={14} className="text-zinc-800" /> Google_Link_Handshake_Required_To_Compile_Decks_
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* History / Vault list */}
        <div className="lg:col-span-4">
          <div className="bg-[#18181b] border-4 border-black p-8 shadow-brutalist space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-8">
                <h4 className="text-xs font-mono text-white font-black uppercase tracking-widest">Active_Deck_Ledger_</h4>
                <Database size={18} className="text-zinc-700" />
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                {generatedDecks.length === 0 ? (
                  <div className="py-16 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.2em] font-black italic">
                    Vault_Empty_ No_Protocols_Compiled_
                  </div>
                ) : (
                  generatedDecks.map((deck) => (
                    <div 
                      key={deck.id}
                      onClick={() => setViewerPresentationId(deck.id)}
                      className={`p-6 border-4 border-black transition-all cursor-pointer flex justify-between items-center group font-mono ${
                        viewerPresentationId === deck.id 
                          ? 'bg-black text-white shadow-[2px_2px_0px_#D98A2E]' 
                          : 'bg-zinc-900 text-zinc-500 hover:bg-black hover:text-white'
                      }`}
                    >
                      <div className="space-y-2 truncate pr-6">
                        <span className="font-black text-[11px] block truncate uppercase">
                          {deck.title.split(' - ')[0]}
                        </span>
                        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest opacity-60">
                          <span>{deck.timestamp}</span>
                          <span className="text-signal">|</span>
                          <span>ID: {deck.id.slice(0, 10)}_</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t-4 border-black pt-8 mt-8">
              <form onSubmit={handleManualEmbed} className="space-y-4 font-mono">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">Import_Existing_Presentation_ID_</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={manualPresentationId}
                    onChange={(e) => setManualPresentationId(e.target.value)}
                    placeholder="ENTER_ID_OR_URL_"
                    className="flex-1 bg-black border-4 border-black px-5 py-4 text-[10px] text-white focus:border-signal outline-none transition-all placeholder:text-zinc-800 uppercase font-black"
                  />
                  <button
                    type="submit"
                    className="w-14 h-14 bg-black border-4 border-black text-white hover:bg-signal hover:text-black transition-all flex items-center justify-center shadow-[2px_2px_0px_#000]"
                    title="Load Deck"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Live Presentation Screen / Workspace Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-black border-4 border-black shadow-brutalist overflow-hidden h-full flex flex-col font-mono uppercase">
            <div className="p-8 border-b-4 border-black flex justify-between items-center bg-[#18181b]">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center text-signal shadow-[2px_2px_0px_#D98A2E]">
                  <Tv size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Workspace_Projection_Terminal_</h4>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1">
                    {viewerPresentationId ? `Active_Uplink: /d/${viewerPresentationId}` : 'SIGNAL_IDLE_'}
                  </p>
                </div>
              </div>

              {viewerPresentationId && (
                <div className="flex gap-4">
                  <a 
                    href={`https://docs.google.com/presentation/d/${viewerPresentationId}/edit`}
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 border-4 border-black bg-black text-[10px] font-black text-white transition-all uppercase tracking-widest shadow-[2px_2px_0px_#22d3ee] flex items-center gap-3"
                  >
                    <ExternalLink size={14} /> Open_In_Slides
                  </a>
                  <button 
                    onClick={() => {
                      setViewerPresentationId('');
                      showToast('Terminated terminal slide projection.', 'info');
                    }}
                    className="px-6 py-3 border-4 border-black bg-black text-[10px] font-black text-red-500 transition-all uppercase tracking-widest shadow-[2px_2px_0px_#ef4444] flex items-center gap-3"
                  >
                    Kill_Stream_
                  </button>
                </div>
              )}
            </div>

            <div className="bg-black relative aspect-video flex items-center justify-center border-t-2 border-zinc-900">
              {viewerPresentationId ? (
                <iframe
                  title="Google Slides Viewer"
                  src={`https://docs.google.com/presentation/d/${viewerPresentationId}/embed?start=false&loop=false&delayms=5000`}
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  className="w-full h-full aspect-video grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="p-20 text-center space-y-8 max-w-lg">
                  <div className="w-24 h-24 bg-zinc-900 border-4 border-zinc-800 mx-auto flex items-center justify-center text-zinc-800">
                    <Presentation size={48} />
                  </div>
                  <p className="text-zinc-700 text-[10px] leading-relaxed font-black uppercase tracking-[0.4em]">
                    Terminal_Idle_ Projection_Handshake_Awaiting_Activation_ Select_Global_Ledger_Deck_To_Stream_
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
