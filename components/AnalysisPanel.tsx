import React from 'react';
import { VisualizationData } from '../types';
import { Clock, Database, AlertCircle, CheckCircle2, Tag } from 'lucide-react';

interface AnalysisPanelProps {
  data: VisualizationData;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Summary</h3>
        <p className="text-zinc-100 leading-relaxed">{data.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {data.tags.map((tag, i) => (
            <span key={i} className="flex items-center text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 flex items-start space-x-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-400">Time Complexity</h4>
            <div className="text-xl font-mono text-emerald-400 font-bold">{data.complexity.time}</div>
            <p className="text-xs text-zinc-500 mt-1">{data.complexity.explanation}</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 flex items-start space-x-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Database size={24} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-400">Space Complexity</h4>
            <div className="text-xl font-mono text-blue-400 font-bold">{data.complexity.space}</div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center">
            <CheckCircle2 size={16} className="mr-2 text-indigo-400"/>
            Key Examples
        </h3>
        <div className="space-y-4">
          {data.examples.map((ex, idx) => (
            <div key={idx} className="bg-zinc-950 p-3 rounded border border-zinc-800/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono mb-2">
                <div>
                  <span className="text-zinc-500 block text-xs">Input</span>
                  <span className="text-zinc-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">Output</span>
                  <span className="text-zinc-200">{ex.output}</span>
                </div>
              </div>
              <p className="text-sm text-zinc-400 border-t border-zinc-800 pt-2">{ex.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Cases */}
      <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
            <AlertCircle size={16} className="mr-2 text-amber-400"/>
            Critical Edge Cases
        </h3>
        <ul className="space-y-2">
            {data.edgeCases.map((ec, idx) => (
                <li key={idx} className="text-zinc-300 text-sm flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 mr-2 shrink-0"></span>
                    {ec}
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPanel;