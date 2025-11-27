import React, { useState } from 'react';
import { analyzeProblem } from './services/geminiService';
import { VisualizationData } from './types';
import MermaidDiagram from './components/MermaidDiagram';
import AnalysisPanel from './components/AnalysisPanel';
import { 
  Code2, 
  Sparkles, 
  Layout, 
  GitGraph, 
  Network, 
  ChevronRight, 
  Loader2,
  BookOpen
} from 'lucide-react';

const EXAMPLE_PROMPT = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`;

function App() {
  const [input, setInput] = useState<string>(EXAMPLE_PROMPT);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VisualizationData | null>(null);
  const [activeTab, setActiveTab] = useState<'flow' | 'structure' | 'analysis'>('flow');

  const handleVisualize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeProblem(input);
      setData(result);
    } catch (err) {
      alert("Failed to analyze. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* Left Sidebar: Input */}
      <div className="w-1/3 min-w-[350px] flex flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Code2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AlgoVisualizer</h1>
            <p className="text-xs text-zinc-400">Powered by Gemini 2.5</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between items-center">
             Problem Statement
             <button 
                onClick={() => setInput(EXAMPLE_PROMPT)} 
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
             >
                Load Example
             </button>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your coding problem here (e.g., LeetCode description)..."
            className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm leading-relaxed text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-mono scrollbar-hide"
            spellCheck={false}
          />
          
          <button
            onClick={handleVisualize}
            disabled={loading || !input.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Logic...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Visualize Solution
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Content: Visualization */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {!data ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
               <Layout size={40} className="opacity-20" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300 mb-2">Ready to Visualize</h3>
            <p className="max-w-md">Paste a problem statement on the left and hit "Visualize Solution" to see the algorithmic flow, data structures, and analysis.</p>
          </div>
        ) : (
          <>
            {/* Tabs Header */}
            <div className="h-16 border-b border-zinc-800 flex items-center px-6 gap-6 bg-zinc-900/30 backdrop-blur-sm">
                <button 
                    onClick={() => setActiveTab('flow')}
                    className={`flex items-center gap-2 h-full border-b-2 px-1 transition-colors ${activeTab === 'flow' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                    <GitGraph size={18} />
                    <span className="font-medium text-sm">Logic Flow</span>
                </button>
                <button 
                    onClick={() => setActiveTab('structure')}
                    className={`flex items-center gap-2 h-full border-b-2 px-1 transition-colors ${activeTab === 'structure' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                    <Network size={18} />
                    <span className="font-medium text-sm">Data Structures</span>
                </button>
                <button 
                    onClick={() => setActiveTab('analysis')}
                    className={`flex items-center gap-2 h-full border-b-2 px-1 transition-colors ${activeTab === 'analysis' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                    <BookOpen size={18} />
                    <span className="font-medium text-sm">Analysis</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/50">
               {activeTab === 'flow' && (
                 <div className="h-full flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-200">Algorithmic Flow</h2>
                        <p className="text-sm text-zinc-500">Visual representation of the solution logic.</p>
                    </div>
                    <div className="flex-1 min-h-[500px]">
                        <MermaidDiagram chart={data.mermaidChart} name="flow" />
                    </div>
                 </div>
               )}

               {activeTab === 'structure' && (
                 <div className="h-full flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-zinc-200">State & Data Structures</h2>
                        <p className="text-sm text-zinc-500">Visualization of data organization and state transitions.</p>
                    </div>
                    <div className="flex-1 min-h-[500px]">
                        <MermaidDiagram chart={data.dataStructureChart} name="struct" />
                    </div>
                 </div>
               )}

               {activeTab === 'analysis' && (
                 <div className="max-w-4xl mx-auto w-full">
                    <AnalysisPanel data={data} />
                 </div>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;