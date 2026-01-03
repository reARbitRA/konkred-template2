
import React, { useEffect, useRef, useState } from 'react';
import { Globe, Maximize2, Wifi } from 'lucide-react';

const GlobalMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNodes, setActiveNodes] = useState(1242);
  const [throughput, setThroughput] = useState(42);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    
    const setSize = () => {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Configuration
    const NODE_COUNT = 40;
    const CONNECTION_DISTANCE = 150;
    const PACKET_SPEED = 2;

    // Entities
    const nodes: { x: number; y: number; vx: number; vy: number; type: 'core' | 'edge' }[] = [];
    const packets: { from: number; to: number; progress: number; speed: number }[] = [];

    // Initialize Nodes
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            type: Math.random() > 0.9 ? 'core' : 'edge'
        });
    }

    // Animation Loop
    let animationFrameId: number;

    const render = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Update Nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off walls
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        // Draw Connections
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)'; // Sky-400 equivalent
        ctx.lineWidth = 1;

        nodes.forEach((nodeA, i) => {
            nodes.forEach((nodeB, j) => {
                if (i <= j) return; // Avoid double drawing
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.stroke();

                    // Randomly spawn packet
                    if (Math.random() > 0.995) {
                        packets.push({ from: i, to: j, progress: 0, speed: PACKET_SPEED / dist });
                    }
                }
            });
        });

        // Draw & Update Packets
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;
            
            if (p.progress >= 1) {
                packets.splice(i, 1);
                continue;
            }

            const start = nodes[p.from];
            const end = nodes[p.to];
            const x = start.x + (end.x - start.x) * p.progress;
            const y = start.y + (end.y - start.y) * p.progress;

            ctx.fillStyle = '#ff9500'; // Neon Cyan/Orange highlight
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Trail
            ctx.fillStyle = 'rgba(255, 149, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Nodes
        nodes.forEach(node => {
            ctx.fillStyle = node.type === 'core' ? '#a855f7' : '#38bdf8'; // Purple or Blue
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.type === 'core' ? 4 : 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow
            const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 10);
            glow.addColorStop(0, node.type === 'core' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(56, 189, 248, 0.3)');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Data simulation
    const interval = setInterval(() => {
        setThroughput(prev => prev + (Math.random() - 0.5) * 5);
        setActiveNodes(prev => Math.floor(prev + (Math.random() - 0.5) * 2));
    }, 1000);

    return () => {
        window.removeEventListener('resize', setSize);
        cancelAnimationFrame(animationFrameId);
        clearInterval(interval);
    };
  }, []);

  return (
    <div className="concrete-card p-0 rounded-[3rem] bg-black/40 border-white/5 relative overflow-hidden h-full group flex flex-col shadow-2xl">
       <div className="absolute inset-0 bg-void opacity-50 z-0 pointer-events-none" />
       
       <header className="absolute top-0 left-0 w-full p-8 z-10 flex justify-between items-start pointer-events-none">
          <div>
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest flex items-center gap-3 backdrop-blur-sm bg-black/20 p-2 rounded-lg border border-white/5 inline-flex">
                <Globe size={16} className="text-neon-blue animate-pulse" /> Network_Topology
            </h3>
            <p className="text-[10px] text-ghost mt-2 uppercase tracking-widest font-bold ml-1">Live Transaction Layer</p>
          </div>
          <div className="flex gap-2">
             <div className="p-2 bg-black/40 rounded-lg border border-white/10 backdrop-blur-md">
                <Maximize2 size={14} className="text-ghost" />
             </div>
          </div>
       </header>

       <div ref={containerRef} className="relative flex-1 w-full h-full min-h-[400px]">
          <canvas ref={canvasRef} className="absolute inset-0 z-0" />
       </div>

       <div className="absolute bottom-0 left-0 w-full p-8 z-10 pointer-events-none">
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md">
                <span className="text-[8px] font-mono text-ghost uppercase block mb-1">Active Nodes</span>
                <span className="text-xl font-black text-white font-mono">{activeNodes}</span>
            </div>
            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md">
                <span className="text-[8px] font-mono text-ghost uppercase block mb-1 flex items-center gap-2">
                    Throughput <Wifi size={10} className="text-neon-green" />
                </span>
                <span className="text-xl font-black text-neon-green font-mono">{throughput.toFixed(1)} GB/s</span>
            </div>
          </div>
       </div>
    </div>
  );
};

export default GlobalMap;
