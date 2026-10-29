import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMazeStore } from '../../store/mazeStore';
import { AlgorithmType } from '../../algorithms/types';

export const ExperimentCharts: React.FC = () => {
  const { comparisonResults, benchmarkAggregates } = useMazeStore();

  const algos: AlgorithmType[] = ['DFS', 'BFS', 'DIJKSTRA', 'ASTAR'];

  // Current single maze data
  const singleRunData = algos
    .map((algo) => {
      const res = comparisonResults[algo];
      if (!res) return null;
      return {
        algorithm: algo,
        runtimeMs: res.executionTimeMs,
        expandedNodes: res.expandedNodes,
        discoveredNodes: res.discoveredNodes,
        pathLength: res.pathLength || 0,
        memoryKB: parseFloat((res.estimatedMemoryBytes / 1024).toFixed(2)),
      };
    })
    .filter(Boolean);

  // Aggregated repeated benchmark data if available
  const aggregateData = benchmarkAggregates
    ? algos.map((algo) => {
        const agg = benchmarkAggregates[algo];
        return {
          algorithm: algo,
          avgRuntimeMs: agg?.avgRuntimeMs ?? 0,
          medianRuntimeMs: agg?.medianRuntimeMs ?? 0,
          avgExpandedNodes: agg?.avgExpandedNodes ?? 0,
          avgPathLength: agg?.avgPathLength ?? 0,
          avgMemoryKB: agg ? parseFloat((agg.avgMemoryBytes / 1024).toFixed(2)) : 0,
        };
      })
    : null;

  return (
    <section className="bg-white border border-borders rounded p-4 shadow-xs mt-4">
      <div className="pb-3 mb-4 border-b border-borders">
        <h2 className="text-sm font-semibold text-primaryText">
          Performance Visualization & Metric Distinctions
        </h2>
        <p className="text-xs text-secondaryText">
          Empirical measurements plotted strictly from executed test runs. Runtime excludes rendering and animation latency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Expanded Nodes Comparison */}
        <div className="bg-slate-50 p-3 rounded border border-borders flex flex-col">
          <div className="text-xs font-semibold text-primaryText mb-2">
            1. Explored / Expanded Vertices
          </div>
          <div className="h-56 w-full text-xs">
            {singleRunData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={singleRunData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E1EA', fontSize: 11 }}
                  />
                  <Bar dataKey="expandedNodes" fill="#2563EB" name="Expanded Nodes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-secondaryText text-xs">
                Run evaluation to display chart
              </div>
            )}
          </div>
          <div className="text-[11px] text-secondaryText mt-2">
            Measures search efficiency: A* prunes irrelevant subtrees towards the goal using the Manhattan heuristic.
          </div>
        </div>

        {/* Chart 2: Runtime Comparison */}
        <div className="bg-slate-50 p-3 rounded border border-borders flex flex-col">
          <div className="text-xs font-semibold text-primaryText mb-2">
            2. Pure Algorithm Execution Time (ms)
          </div>
          <div className="h-56 w-full text-xs">
            {singleRunData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={singleRunData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E1EA', fontSize: 11 }}
                  />
                  <Bar dataKey="runtimeMs" fill="#0D9488" name="Runtime (ms)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-secondaryText text-xs">
                Run evaluation to display chart
              </div>
            )}
          </div>
          <div className="text-[11px] text-secondaryText mt-2">
            Measured via high-resolution `performance.now()`. Excludes DOM repaint and animation loop delays.
          </div>
        </div>

        {/* Chart 3: Path Length Comparison */}
        <div className="bg-slate-50 p-3 rounded border border-borders flex flex-col">
          <div className="text-xs font-semibold text-primaryText mb-2">
            3. Final Path Length (Steps)
          </div>
          <div className="h-56 w-full text-xs">
            {singleRunData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={singleRunData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E1EA', fontSize: 11 }}
                  />
                  <Bar dataKey="pathLength" fill="#FBBF24" name="Path Length" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-secondaryText text-xs">
                Run evaluation to display chart
              </div>
            )}
          </div>
          <div className="text-[11px] text-secondaryText mt-2">
            BFS, Dijkstra, and A* yield identical optimal path lengths on unweighted mazes. DFS is typically suboptimal.
          </div>
        </div>
      </div>

      {/* Aggregated Benchmark Charts if repeated experiment exists */}
      {aggregateData && (
        <div className="mt-6 pt-4 border-t border-borders">
          <div className="text-xs font-semibold text-primaryText mb-3">
            Repeated Empirical Trials Aggregates (Across Multiple Seeds)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded border border-borders h-64 text-xs">
              <div className="font-semibold text-primaryText mb-1">
                Average vs Median Runtime (ms)
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={aggregateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E1EA', fontSize: 11 }}
                  />
                  <Legend />
                  <Bar dataKey="avgRuntimeMs" fill="#2563EB" name="Avg Runtime (ms)" />
                  <Bar dataKey="medianRuntimeMs" fill="#0D9488" name="Median Runtime (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-borders h-64 text-xs">
              <div className="font-semibold text-primaryText mb-1">
                Average Explored Vertices
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={aggregateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D9E1EA', fontSize: 11 }}
                  />
                  <Bar dataKey="avgExpandedNodes" fill="#6366F1" name="Avg Expanded Nodes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

