import React, { useEffect } from 'react';
import { useMazeStore } from '../../store/mazeStore';
import { AlgorithmType } from '../../algorithms/types';
import { Check, X, ArrowRight } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const { comparisonResults, selectedAlgorithm, runComparisonOnCurrentMaze, setSelectedAlgorithm } = useMazeStore();

  const algos: AlgorithmType[] = ['DFS', 'BFS', 'DIJKSTRA', 'ASTAR'];

  // Auto-run single comparison once on mount if empty
  useEffect(() => {
    if (!comparisonResults.ASTAR && !comparisonResults.BFS) {
      runComparisonOnCurrentMaze();
    }
  }, [runComparisonOnCurrentMaze, comparisonResults.ASTAR, comparisonResults.BFS]);

  return (
    <section className="bg-white border border-borders rounded p-4 shadow-xs mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-borders">
        <div>
          <h2 className="text-sm font-semibold text-primaryText">
            Algorithm Comparative Laboratory (Identical Maze Instance)
          </h2>
          <p className="text-xs text-secondaryText">
            All four algorithms evaluated concurrently on the current grid with start and goal preserved.
          </p>
        </div>
        <button
          onClick={runComparisonOnCurrentMaze}
          className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 border border-borders rounded text-primaryText transition-colors flex items-center gap-1.5"
        >
          Re-evaluate Maze
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-borders bg-slate-50 text-secondaryText">
              <th className="py-2.5 px-3 font-semibold">Algorithm</th>
              <th className="py-2.5 px-3 font-semibold">Path Length</th>
              <th className="py-2.5 px-3 font-semibold">Expanded Nodes</th>
              <th className="py-2.5 px-3 font-semibold">Discovered Nodes</th>
              <th className="py-2.5 px-3 font-semibold">Peak Frontier</th>
              <th className="py-2.5 px-3 font-semibold">Runtime (ms)</th>
              <th className="py-2.5 px-3 font-semibold">Est. Memory</th>
              <th className="py-2.5 px-3 font-semibold">Shortest Guarantee</th>
              <th className="py-2.5 px-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borders">
            {algos.map((algo) => {
              const res = comparisonResults[algo];
              const isSelected = selectedAlgorithm === algo;

              return (
                <tr
                  key={algo}
                  className={`transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-medium' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-primaryText flex items-center gap-1.5">
                    {algo}
                    {isSelected && (
                      <span className="text-[10px] font-semibold bg-primaryBlue text-white px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {res?.pathLength !== null && res?.pathLength !== undefined ? (
                      res.pathLength
                    ) : (
                      <span className="text-secondaryText">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono">{res?.expandedNodes ?? '—'}</td>
                  <td className="py-2.5 px-3 font-mono">{res?.discoveredNodes ?? '—'}</td>
                  <td className="py-2.5 px-3 font-mono">{res?.maxFrontierSize ?? '—'}</td>
                  <td className="py-2.5 px-3 font-mono">{res?.executionTimeMs ?? '—'}</td>
                  <td className="py-2.5 px-3 font-mono">
                    {res?.estimatedMemoryBytes
                      ? `${(res.estimatedMemoryBytes / 1024).toFixed(1)} KB`
                      : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    {algo === 'DFS' ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                        <X className="w-3.5 h-3.5" /> No
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <Check className="w-3.5 h-3.5" /> Yes
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => setSelectedAlgorithm(algo)}
                      className="text-primaryBlue hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Select <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[11px] text-secondaryText flex items-center justify-between border-t border-slate-100 pt-2">
        <span>
          Note: BFS and Dijkstra guarantee optimal shortest path lengths on unweighted corridors.
          A* with Manhattan heuristic also achieves optimality while exploring fewer vertices.
        </span>
      </div>
    </section>
  );
};
