
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Cpu, Database, Globe, Zap, Play, Save, Plus, X, 
  Settings, MoreHorizontal, Layers, Code, Search, MousePointer2, ZoomIn, ZoomOut, Move, RotateCcw, Trash2, Sparkles, Loader2
} from 'lucide-react';
import Badge from '../common/Badge.tsx';
import { suggestNodeConnections } from '../../services/gemini.ts';
import { useToast } from '../../contexts/ToastContext.tsx';

// --- Types ---
interface NodeData {
  label: string;
  status?: 'idle' | 'active' | 'success' | 'error';
  model?: string;
  endpoint?: string;
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

const NODE_WIDTH = 280;
const PORT_OFFSET_Y = 105;

const AgentBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'n1', type: 'trigger', x: 100, y: 300, data: { label: 'User_Input_Stream', status: 'idle' } },
    { id: 'n2', type: 'llm', x: 500, y: 200, data: { label: 'Reasoning_Core_v4', model: 'Gemini-1.5-Pro', status: 'idle' } },
    { id: 'n3', type: 'api', x: 500, y: 450, data: { label: 'Knowledge_Retrieval', endpoint: 'https://api.konkred.xyz/v1/vector-db', status: 'idle' } },
    { id: 'n4', type: 'llm', x: 900, y: 325, data: { label: 'Response_Synthesizer', model: 'Gemini-1.5-Flash', status: 'idle' } },
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
  const [drawingEdge, setDrawingEdge] = useState<{ sourceId: string; sourceX: number; sourceY: number } | null>(null);
  const [edgePreview, setEdgePreview] = useState<{ x: number; y: number } | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, []);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    setSelectedEdge(null);
  }, []);

  const handleUpdateNodeData = (nodeId: string, newData: Partial<NodeData>) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n));
  };

  const handleGetInsight = async () => {
    setIsAnalyzing(true);
    try {
      const insight = await suggestNodeConnections(nodes, edges);
      showToast(insight.suggestion, "info", 8000);
    } catch (err) {
      showToast("Neural uplink failed during insight synthesis.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 10);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setViewport(prev => ({ ...prev, zoom: Math.min(Math.max(prev.zoom + delta, 0.2), 2) }));
    } else {
      setViewport(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNode(id);
    setSelectedNode(id);
    setSelectedEdge(null);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePortMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setDrawingEdge({ sourceId: nodeId, sourceX: node.x + NODE_WIDTH, sourceY: node.y + PORT_OFFSET_Y });
  };

  const handlePortMouseUp = (e: React.MouseEvent, targetNodeId: string) => {
    e.stopPropagation();
    if (drawingEdge && drawingEdge.sourceId !== targetNodeId) {
      const newEdge: Edge = { id: `e-${Date.now()}`, source: drawingEdge.sourceId, target: targetNodeId };
      setEdges(prev => [...prev, newEdge]);
    }
    setDrawingEdge(null);
    setEdgePreview(null);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (drawingEdge && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setEdgePreview({ 
        x: (e.clientX - rect.left - viewport.x) / viewport.zoom, 
        y: (e.clientY - rect.top - viewport.y) / viewport.zoom 
      });
    } else if (draggingNode) {
      const dx = (e.clientX - dragStart.x) / viewport.zoom;
      const dy = (e.clientY - dragStart.y) / viewport.zoom;
      setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x: n.x + dx, y: n.y + dy } : n));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isDraggingCanvas) {
      setViewport(prev => ({ ...prev, x: prev.x + (e.clientX - dragStart.x), y: prev.y + (e.clientY - dragStart.y) }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [drawingEdge, draggingNode, isDraggingCanvas, dragStart, viewport]);

  const handleMouseUp = useCallback(() => {
    setDrawingEdge(null);
    setEdgePreview(null);
    setDraggingNode(null);
    setIsDraggingCanvas(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const sequence = ['n1', ['n2', 'n3'], 'n4'];
    setNodes(prev => prev.map(n => ({ ...n, data: { ...n.data, status: 'idle' } })));
    for (const step of sequence) {
      const ids = Array.isArray(step) ? step : [step];
      setNodes(prev => prev.map(n => ids.includes(n.id) ? { ...n, data: { ...n.data, status: 'active' } } : n));
      await new Promise(r => setTimeout(r, 1200));
      setNodes(prev => prev.map(n => ids.includes(n.id) ? { ...n, data: { ...n.data, status: 'success' } } : n));
    }
    setIsSimulating(false);
  };

  const getPath = (source: Node, target: Node) => {
    const sX = source.x + NODE_WIDTH;
    const sY = source.y + PORT_OFFSET_Y;
    const tX = target.x;
    const tY = target.y + PORT_OFFSET_Y;
    const dist = Math.abs(tX - sX) * 0.5;
    return `M ${sX} ${sY} C ${sX + dist} ${sY}, ${tX - dist} ${tY}, ${tX} ${tY}`;
  };

  const activeNode = nodes.find(n => n.id === selectedNode);

  return (
    <div className="h-full flex flex-col concrete-card bg-[#050505] rounded-[2.5rem] border-white/5 overflow-hidden animate-in zoom-in-95 duration-700 shadow-2xl relative">
      <div className="h-16 border-b border-white/5 bg-void-200/50 backdrop-blur-xl flex justify-between items-center px-6 relative z-20">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-neon-purple">
              <Layers size={18} />
              <span className="text-xs font-mono font-black uppercase tracking-[0.2em]">Agent_Architect_v4.2</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={handleGetInsight} 
             disabled={isAnalyzing}
             className="px-4 py-2 bg-neon-purple/10 text-neon-purple border border-neon-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50"
           >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Neural Insight
           </button>
           <button onClick={handleSimulate} disabled={isSimulating} className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neon-green transition-all disabled:opacity-50">
              <Play size={14} fill="currentColor" />
              {isSimulating ? 'Processing...' : 'Deploy Simulation'}
           </button>
        </div>
      </div>

      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-[#030304] cursor-crosshair"
        onWheel={handleWheel}
        onMouseDown={(e) => { if(e.button === 1 || e.shiftKey) setIsDraggingCanvas(true); setDragStart({x:e.clientX, y:e.clientY}); }}
      >
        <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ 
               transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
               transformOrigin: '0 0',
               backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
            }} 
        />
        <div 
            className="absolute top-0 left-0 w-full h-full transform-gpu"
            style={{ 
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                transformOrigin: '0 0'
            }}
        >
            <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ width: 1, height: 1 }}>
               {edges.map(edge => {
                 const s = nodes.find(n => n.id === edge.source);
                 const t = nodes.find(n => n.id === edge.target);
                 if (!s || !t) return null;
                 const isActive = s.data.status === 'active' || s.data.status === 'success';
                 return (
                   <g key={edge.id} onClick={() => setSelectedEdge(edge.id)}>
                       <path d={getPath(s, t)} stroke={isActive ? "#ff9500" : "#27272a"} strokeWidth={2} fill="none" className="transition-all duration-500" />
                       {isActive && (
                         <circle r="3" fill="#ff9500">
                           <animateMotion path={getPath(s, t)} dur="1.5s" repeatCount="indefinite" />
                         </circle>
                       )}
                   </g>
                 );
               })}
               {drawingEdge && edgePreview && (
                 <path d={`M ${drawingEdge.sourceX} ${drawingEdge.sourceY} L ${edgePreview.x} ${edgePreview.y}`} stroke="#ff9500" strokeWidth={2} strokeDasharray="5 5" fill="none" />
               )}
            </svg>

            {nodes.map(node => (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className={`absolute w-[280px] rounded-2xl border bg-[#0a0a0c]/90 backdrop-blur-xl transition-all duration-300 p-4 ${selectedNode === node.id ? 'border-neon-cyan ring-1 ring-neon-cyan/50 shadow-[0_0_20px_rgba(255,149,0,0.1)]' : 'border-white/5'}`}
                style={{ left: node.x, top: node.y }}
              >
                <div className="flex justify-between items-center mb-4">
                   <Badge variant={node.type === 'llm' ? 'purple' : 'cyan'}>{node.type}</Badge>
                   <div className={`w-2 h-2 rounded-full ${node.data.status === 'success' ? 'bg-neon-green' : node.data.status === 'active' ? 'bg-neon-gold animate-pulse' : 'bg-white/10'}`} />
                </div>
                <div className="text-xs font-bold text-white mb-2">{node.data.label}</div>
                {node.data.model && <div className="text-[9px] font-mono text-ghost bg-white/5 p-1 rounded">MODEL: {node.data.model}</div>}
                
                <div onMouseDown={(e) => handlePortMouseDown(e, node.id)} className="absolute -right-1.5 top-[105px] w-3 h-3 bg-[#030304] border border-white/20 rounded-full hover:bg-neon-cyan hover:scale-125 transition-all cursor-pointer" />
                <div onMouseUp={(e) => handlePortMouseUp(e, node.id)} className="absolute -left-1.5 top-[105px] w-3 h-3 bg-[#030304] border border-white/20 rounded-full hover:bg-neon-cyan hover:scale-125 transition-all cursor-pointer" />
              </div>
            ))}
        </div>
      </div>

      {selectedNode && activeNode && (
        <div className="absolute top-20 right-6 w-80 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right-10 z-30">
           <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Node_Config</span>
              <button onClick={() => setSelectedNode(null)} className="text-ghost hover:text-white"><X size={14} /></button>
           </div>
           <div className="space-y-6">
             <div>
                <label className="text-[9px] font-mono text-ghost uppercase tracking-widest block mb-2">Designation</label>
                <input value={activeNode.data.label} onChange={(e) => handleUpdateNodeData(selectedNode, { label: e.target.value })} className="w-full bg-void-200 border border-white/10 rounded-lg px-4 py-2 text-xs text-white" />
             </div>
             <button onClick={() => handleDeleteNode(selectedNode)} className="w-full py-2 bg-neon-red/10 text-neon-red border border-neon-red/20 rounded-lg text-[9px] font-black uppercase tracking-widest">Terminate Node</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
