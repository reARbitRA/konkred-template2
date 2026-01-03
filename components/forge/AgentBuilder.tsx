
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Cpu, Database, Globe, Zap, Play, Save, Plus, X, 
  Settings, MoreHorizontal, Layers, Code, Search, MousePointer2, ZoomIn, ZoomOut, Move
} from 'lucide-react';
import Badge from '../common/Badge.tsx';

// --- Types ---
interface NodeData {
  label: string;
  model?: string;
  endpoint?: string;
  status?: 'idle' | 'active' | 'success' | 'error';
}

interface Node {
  id: string;
  type: 'trigger' | 'llm' | 'api' | 'condition';
  x: number;
  y: number;
  data: NodeData;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// --- Constants ---
const NODE_WIDTH = 280;

const AgentBuilder: React.FC = () => {
  // --- State ---
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'n1', type: 'trigger', x: 100, y: 300, data: { label: 'User_Input_Stream', status: 'idle' } },
    { id: 'n2', type: 'llm', x: 500, y: 200, data: { label: 'Reasoning_Core_v4', model: 'Gemini-Pro-1.5', status: 'idle' } },
    { id: 'n3', type: 'api', x: 500, y: 450, data: { label: 'Knowledge_Retrieval', endpoint: '/v1/vector-db', status: 'idle' } },
    { id: 'n4', type: 'llm', x: 900, y: 325, data: { label: 'Response_Synthesizer', model: 'Gemini-Ultra', status: 'idle' } },
  ]);
  
  const [edges, setEdges] = useState<Edge[]>([
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e1b', source: 'n1', target: 'n3' },
    { id: 'e2', source: 'n2', target: 'n4' },
    { id: 'e3', source: 'n3', target: 'n4' },
  ]);

  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Search Library ---
  const nodeLibrary = [
    { type: 'llm', label: 'Gemini 1.5 Flash', category: 'AI' },
    { type: 'llm', label: 'Gemini 1.5 Pro', category: 'AI' },
    { type: 'api', label: 'Google Search Grounding', category: 'Tools' },
    { type: 'api', label: 'Gmail Sender', category: 'Tools' },
    { type: 'condition', label: 'If/Else Logic Router', category: 'Logic' },
    { type: 'trigger', label: 'Webhook Listener', category: 'Trigger' },
    { type: 'api', label: 'Pinecone Retrieval', category: 'Database' },
    { type: 'llm', label: 'Claude 3.5 Sonnet', category: 'AI' },
  ];

  const filteredLibrary = nodeLibrary.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNodes = nodes.filter(n => n.data.label.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- Handlers: Canvas Navigation ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newZoom = Math.min(Math.max(viewport.zoom + delta, 0.2), 2);
      setViewport(prev => ({ ...prev, zoom: newZoom }));
    } else {
      // Pan
      setViewport(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  }, [viewport]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle click or Space (handled elsewhere) + Drag
    if (e.button === 1 || e.shiftKey || e.buttons === 4) { 
        e.preventDefault();
        setIsDraggingCanvas(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNode(id);
    setSelectedNode(id);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingCanvas) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: e.clientX, y: e.clientY });
    } else if (draggingNode) {
        // Adjust drag delta by zoom level to keep cursor synchronized
        const dx = (e.clientX - dragStart.x) / viewport.zoom;
        const dy = (e.clientY - dragStart.y) / viewport.zoom;
        setNodes(prev => prev.map(n => 
            n.id === draggingNode ? { ...n, x: n.x + dx, y: n.y + dy } : n
        ));
        setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDraggingCanvas, draggingNode, dragStart, viewport.zoom]);

  const handleGlobalMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
    setDraggingNode(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // --- Handlers: Logic ---
  const handleAddNode = (item: any) => {
      // Center new node in current viewport
      const containerWidth = canvasRef.current?.clientWidth || 800;
      const containerHeight = canvasRef.current?.clientHeight || 600;
      
      const centerX = (-viewport.x + containerWidth / 2) / viewport.zoom;
      const centerY = (-viewport.y + containerHeight / 2) / viewport.zoom;

      const newNode: Node = {
          id: `n${Date.now()}`,
          type: item.type as any,
          x: centerX - (NODE_WIDTH / 2) + (Math.random() * 40 - 20),
          y: centerY + (Math.random() * 40 - 20),
          data: { label: item.label, status: 'idle' }
      };
      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode.id);
      setSearchQuery('');
      setShowSearch(false);
  };

  const focusNode = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node && canvasRef.current) {
          const containerWidth = canvasRef.current.clientWidth;
          const containerHeight = canvasRef.current.clientHeight;
          
          setViewport({
              x: -node.x * viewport.zoom + (containerWidth / 2) - (NODE_WIDTH / 2) * viewport.zoom,
              y: -node.y * viewport.zoom + (containerHeight / 2) - 100 * viewport.zoom,
              zoom: viewport.zoom
          });
          setSelectedNode(nodeId);
          setShowSearch(false);
      }
  };

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    // Reset statuses
    setNodes(prev => prev.map(n => ({ ...n, data: { ...n.data, status: 'idle' } })));

    // Simulation sequence
    const sequence = ['n1', ['n2', 'n3'], 'n4'];
    
    for (const step of sequence) {
        if (Array.isArray(step)) {
            // Parallel execution
            setNodes(prev => prev.map(n => step.includes(n.id) ? { ...n, data: { ...n.data, status: 'active' } } : n));
            await new Promise(r => setTimeout(r, 1500));
            setNodes(prev => prev.map(n => step.includes(n.id) ? { ...n, data: { ...n.data, status: 'success' } } : n));
        } else {
            // Sequential execution
            setNodes(prev => prev.map(n => n.id === step ? { ...n, data: { ...n.data, status: 'active' } } : n));
            await new Promise(r => setTimeout(r, 1200));
            setNodes(prev => prev.map(n => n.id === step ? { ...n, data: { ...n.data, status: 'success' } } : n));
        }
    }
    
    setIsSimulating(false);
  };

  // --- Render Helpers ---
  const getPath = (source: Node, target: Node) => {
    const startX = source.x + NODE_WIDTH;
    const startY = source.y + 70; // Approximation of center-ish vertically
    const endX = target.x;
    const endY = target.y + 70;
    
    const dist = Math.abs(endX - startX);
    const controlPoint1X = startX + dist * 0.5;
    const controlPoint1Y = startY;
    const controlPoint2X = endX - dist * 0.5;
    const controlPoint2Y = endY;

    return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
  };

  const getNodeColor = (type: string, status?: string) => {
    if (status === 'active') return 'border-neon-gold shadow-[0_0_30px_rgba(251,191,36,0.3)] bg-black/80';
    if (status === 'success') return 'border-neon-green shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-black/80';
    
    switch (type) {
        case 'trigger': return 'border-neon-cyan/50 hover:border-neon-cyan shadow-[0_0_10px_rgba(255,149,0,0.1)]';
        case 'llm': return 'border-neon-purple/50 hover:border-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.1)]';
        case 'api': return 'border-neon-blue/50 hover:border-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.1)]';
        case 'condition': return 'border-white/20 hover:border-white/50';
        default: return 'border-white/10';
    }
  };

  return (
    <div className="h-[700px] flex flex-col concrete-card bg-[#050505] rounded-[2.5rem] border-white/5 overflow-hidden animate-in zoom-in-95 duration-700 shadow-2xl relative group">
      
      {/* Toolbar */}
      <div className="h-16 border-b border-white/5 bg-void-200/50 backdrop-blur-xl flex justify-between items-center px-6 relative z-20">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-neon-purple">
              <Layers size={18} />
              <span className="text-xs font-mono font-black uppercase tracking-[0.2em]">Agent_Architect_v4.2</span>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="flex gap-2">
              <button onClick={() => setNodes([])} className="p-2 hover:bg-white/5 rounded-lg text-ghost hover:text-white transition-colors" title="Clear Canvas"><X size={14} /></button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-ghost hover:text-white transition-colors" title="Save Flow"><Save size={14} /></button>
           </div>
        </div>

        {/* Smart Search Bar */}
        <div className="relative group mx-4 hidden md:block z-50">
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus-within:border-neon-cyan/50 focus-within:bg-black/60 transition-all w-96 shadow-inner">
                <Search size={14} className="text-ghost group-focus-within:text-neon-cyan" />
                <input 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                    placeholder="Search nodes, models, or logic gates..."
                    className="bg-transparent border-none outline-none text-xs text-white placeholder-ghost/50 w-full font-mono"
                    onFocus={() => setShowSearch(true)}
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                />
            </div>
            
            {showSearch && searchQuery && (
                <div className="absolute top-full left-0 w-96 mt-2 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                    {filteredNodes.length > 0 && (
                        <div className="p-2">
                            <div className="text-[9px] font-mono text-ghost uppercase tracking-widest px-3 py-1 mb-1">Active Canvas</div>
                            {filteredNodes.map(node => (
                                <button key={node.id} onClick={() => focusNode(node.id)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${node.type === 'llm' ? 'bg-neon-purple' : 'bg-white'}`} />
                                        <span className="text-xs text-white group-hover:text-neon-cyan">{node.data.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-ghost font-mono">ID: {node.id}</span>
                                        <Move size={10} className="text-ghost" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className={`p-2 ${filteredNodes.length > 0 ? 'border-t border-white/5' : ''}`}>
                        <div className="text-[9px] font-mono text-ghost uppercase tracking-widest px-3 py-1 mb-1">Component Library</div>
                        {filteredLibrary.map((item, i) => (
                            <button key={i} onClick={() => handleAddNode(item)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-2">
                                    <Plus size={10} className="text-ghost group-hover:text-white" />
                                    <span className="text-xs text-white font-bold group-hover:text-neon-purple">{item.label}</span>
                                </div>
                                <Badge variant="gray" size="sm">{item.category}</Badge>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewport(v => ({ ...v, zoom: Math.max(0.2, v.zoom - 0.1) }))} className="p-1.5 text-ghost hover:text-white rounded"><ZoomOut size={14} /></button>
              <button onClick={() => setViewport(v => ({ ...v, zoom: 1 }))} className="px-2 text-[10px] font-mono text-ghost min-w-[3rem] text-center">{Math.round(viewport.zoom * 100)}%</button>
              <button onClick={() => setViewport(v => ({ ...v, zoom: Math.min(2, v.zoom + 0.1) }))} className="p-1.5 text-ghost hover:text-white rounded"><ZoomIn size={14} /></button>
           </div>
           <button 
             onClick={handleSimulate}
             disabled={isSimulating}
             className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neon-green hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
           >
             {isSimulating ? <Zap size={14} className="animate-spin" /> : <Play size={14} />}
             {isSimulating ? 'Processing...' : 'Run Simulation'}
           </button>
        </div>
      </div>

      <div 
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden bg-[#030304] select-none ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Infinite Grid Background */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ 
               transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
               transformOrigin: '0 0',
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
            }} 
        />

        {/* Canvas Transform Container */}
        <div 
            className="absolute top-0 left-0 w-full h-full transform-gpu"
            style={{ 
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                transformOrigin: '0 0'
            }}
        >
            {/* Edges Layer */}
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ width: 1, height: 1 }}>
               <defs>
                 <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#ff9500" />
                   <stop offset="100%" stopColor="#a855f7" />
                 </linearGradient>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3f3f46" />
                 </marker>
               </defs>
               {edges.map(edge => {
                 const s = nodes.find(n => n.id === edge.source);
                 const t = nodes.find(n => n.id === edge.target);
                 if (!s || !t) return null;
                 const isActive = s.data.status === 'active' || s.data.status === 'success';
                 return (
                   <g key={edge.id}>
                       {/* Background path for hit area/glow */}
                       <path d={getPath(s, t)} stroke={isActive ? "url(#edge-active)" : "#27272a"} strokeWidth={isActive ? 4 : 2} fill="none" strokeOpacity={isActive ? 0.3 : 1} />
                       {/* Foreground path */}
                       <path 
                         d={getPath(s, t)}
                         stroke={isActive ? "url(#edge-active)" : "#3f3f46"}
                         strokeWidth={2}
                         fill="none"
                         markerEnd={isActive ? "" : "url(#arrowhead)"}
                         className="transition-all duration-500"
                         strokeDasharray={isActive ? "10 5" : "0"}
                       >
                         {isActive && <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />}
                       </path>
                   </g>
                 );
               })}
            </svg>

            {/* Nodes Layer */}
            {nodes.map(node => (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className={`absolute w-[280px] rounded-2xl border backdrop-blur-xl transition-shadow duration-300 group ${getNodeColor(node.type, node.data.status)} ${selectedNode === node.id ? 'ring-1 ring-white/30 z-20' : 'z-10'}`}
                style={{ 
                    left: node.x, 
                    top: node.y,
                    cursor: 'grab' 
                }}
              >
                {/* Node Header */}
                <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/[0.02]">
                   <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-lg ${
                         node.type === 'trigger' ? 'bg-neon-cyan/20 text-neon-cyan' :
                         node.type === 'llm' ? 'bg-neon-purple/20 text-neon-purple' :
                         node.type === 'api' ? 'bg-neon-blue/20 text-neon-blue' :
                         'bg-white/10 text-white'
                       }`}>
                         {node.type === 'trigger' && <Zap size={12} />}
                         {node.type === 'llm' && <Cpu size={12} />}
                         {node.type === 'api' && <Globe size={12} />}
                         {node.type === 'condition' && <Code size={12} />}
                       </div>
                       <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ghost-light">{node.type}</span>
                   </div>
                   <button className="text-ghost hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
                </div>

                {/* Node Body */}
                <div className="p-4 bg-[#0a0a0c]/80 rounded-b-2xl">
                    <div className="text-xs font-bold text-white mb-2">{node.data.label}</div>
                    
                    {node.data.model && (
                        <div className="flex items-center gap-2 text-[10px] text-ghost font-mono bg-white/5 p-2 rounded border border-white/5 mb-2">
                            <Cpu size={10} /> {node.data.model}
                        </div>
                    )}
                    {node.data.endpoint && (
                        <div className="flex items-center gap-2 text-[10px] text-ghost font-mono bg-white/5 p-2 rounded border border-white/5 mb-2">
                            <Globe size={10} /> {node.data.endpoint}
                        </div>
                    )}
                    
                    {/* Status Indicator */}
                    <div className="flex items-center justify-between mt-2">
                        <span className={`text-[8px] font-mono uppercase tracking-widest ${
                            node.data.status === 'success' ? 'text-neon-green' :
                            node.data.status === 'active' ? 'text-neon-gold animate-pulse' :
                            'text-ghost'
                        }`}>
                            {node.data.status === 'idle' ? 'IDLE' : node.data.status}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            node.data.status === 'success' ? 'bg-neon-green shadow-[0_0_5px_#10b981]' :
                            node.data.status === 'active' ? 'bg-neon-gold shadow-[0_0_5px_#fbbf24]' :
                            'bg-white/20'
                        }`} />
                    </div>
                </div>

                {/* Port Handlers */}
                <div className="absolute -left-1.5 top-[60%] w-3 h-3 bg-[#0a0a0c] border border-white/20 rounded-full hover:bg-neon-purple hover:scale-125 transition-all cursor-crosshair" />
                <div className="absolute -right-1.5 top-[60%] w-3 h-3 bg-[#0a0a0c] border border-white/20 rounded-full hover:bg-neon-purple hover:scale-125 transition-all cursor-crosshair" />
              </div>
            ))}
        </div>
        
        {/* Controls Overlay */}
        <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-mono text-ghost uppercase tracking-widest shadow-xl flex items-center gap-2">
                <MousePointer2 size={12} className="text-neon-cyan" />
                {isDraggingCanvas ? 'Panning...' : 'Middle Click to Pan'}
            </div>
        </div>
      </div>

      {/* Side Property Panel */}
      {selectedNode && (
        <div className="absolute top-20 right-6 w-72 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right-10 duration-300 z-30">
           <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Node_Config</span>
              <button onClick={() => setSelectedNode(null)} className="text-ghost hover:text-white"><X size={14} /></button>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[9px] font-mono text-ghost uppercase">Label</label>
                 <input 
                    className="w-full bg-void-200 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-neon-purple transition-all font-mono" 
                    value={nodes.find(n => n.id === selectedNode)?.data.label}
                    onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, data: { ...n.data, label: e.target.value } } : n))}
                 />
              </div>
              
              <div className="space-y-2">
                 <label className="text-[9px] font-mono text-ghost uppercase">Context_Window</label>
                 <div className="p-3 bg-white/[0.03] rounded-lg border border-white/5 font-mono text-[10px] text-neon-cyan">
                    {`{
  "temp": 0.7,
  "top_p": 0.9,
  "stream": true
}`}
                 </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono text-ghost hover:text-white uppercase transition-colors">
                      Duplicate
                  </button>
                  <button 
                    onClick={() => {
                        setNodes(nodes.filter(n => n.id !== selectedNode));
                        setEdges(edges.filter(e => e.source !== selectedNode && e.target !== selectedNode));
                        setSelectedNode(null);
                    }}
                    className="flex-1 py-2 bg-neon-red/10 hover:bg-neon-red/20 text-neon-red rounded-lg text-[10px] font-mono uppercase transition-colors"
                  >
                      Delete
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
