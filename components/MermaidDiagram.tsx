import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertTriangle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  name: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;
      setError(null);
      
      try {
        // Defensive: Clean up markdown blocks if present (case insensitive)
        const cleanChart = chart
          .replace(/```mermaid/gi, '')
          .replace(/```/g, '')
          .trim();

        if (!cleanChart) {
           // Do not throw, just return if empty to avoid processing errors
           return;
        }

        // Unique ID for multiple charts on same page
        const id = `mermaid-${name}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanChart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Reset zoom/pan on new chart
          setScale(1);
          setPosition({ x: 0, y: 0 });
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram. Syntax might be invalid.");
      }
    };

    renderChart();
  }, [chart, name]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    startPosRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPosition({
      x: e.clientX - startPosRef.current.x,
      y: e.clientY - startPosRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-200 text-center">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="font-semibold">Visualization Error</p>
        <p className="text-sm opacity-80 mt-1">{error}</p>
        <details className="mt-4 text-xs opacity-50 whitespace-pre-wrap text-left w-full max-w-md overflow-auto max-h-32 bg-black/20 p-2 rounded">
            <summary className="cursor-pointer hover:text-white mb-1">Raw Diagram Definition</summary>
            {chart}
        </details>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-zinc-900 rounded-lg border border-zinc-800 group">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-zinc-800/80 backdrop-blur p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
         <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-1 hover:bg-zinc-700 rounded text-zinc-300">
            <ZoomIn size={18} />
         </button>
         <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-1 hover:bg-zinc-700 rounded text-zinc-300">
            <ZoomOut size={18} />
         </button>
         <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="p-1 hover:bg-zinc-700 rounded text-zinc-300">
            <RotateCcw size={18} />
         </button>
      </div>

      <div 
        className="w-full h-full flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={containerRef}
          className="transition-transform duration-75 ease-linear origin-center"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            // Prevent text selection while dragging
            userSelect: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default MermaidDiagram;