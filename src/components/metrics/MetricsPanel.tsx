import React from 'react';
import {
  Clock,
  Layers,
  Search,
  Maximize2,
  Route,
  Cpu,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useMazeStore } from '../../store/mazeStore';
import { ALGORITHM_THEORY } from '../../theory/complexity';

export const MetricsPanel: React.FC = () => {
  const { metrics, selectedAlgorithm, currentSnapshot } = useMazeStore();

  const theory = ALGORITHM_THEORY[selectedAlgorithm];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'Paused':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'No Path':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4">
      {/* Live Metrics Card */}
      <section className="bg-white border border-borders rounded p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-borders">
          <div>
            <h2 className="text-xs font-semibold text-secondaryText uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primaryBlue" />
              Live Telemetry
            </h2>
            <div className="text-sm font-semibold text-primaryText mt-0.5">
              {theory?.name || selectedAlgorithm}
            </div>
          </div>
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold border rounded-full ${getStatusBadge(
              metrics.status
            )}`}
          >
            {metrics.status}
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Execution Time */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-secondaryTeal" />
              Runtime
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {metrics.executionTimeMs} <span className="text-xs font-normal text-secondaryText">ms</span>
            </div>
          </div>

          {/* Path Length */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Route className="w-3 h-3 text-amber-500" />
              Path Length
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {metrics.pathLength !== null ? (
                <>
                  {metrics.pathLength}{' '}
                  <span className="text-xs font-normal text-secondaryText">steps</span>
                </>
              ) : metrics.status === 'No Path' ? (
                <span className="text-xs font-medium text-rose-600">No path</span>
              ) : (
                <span className="text-xs font-medium text-secondaryText">Pending</span>
              )}
            </div>
          </div>

          {/* Expanded Nodes */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3 text-primaryBlue" />
              Expanded Nodes
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {metrics.expandedNodes}
            </div>
          </div>

          {/* Discovered Nodes */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Search className="w-3 h-3 text-emerald-600" />
              Discovered Nodes
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {metrics.discoveredNodes}
            </div>
          </div>

          {/* Max Frontier Size */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Maximize2 className="w-3 h-3 text-cyan-600" />
              Peak Frontier
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {metrics.maxFrontierSize}
            </div>
          </div>

          {/* Estimated Memory */}
          <div className="p-2.5 bg-slate-50 border border-borders rounded">
            <div className="text-[11px] text-secondaryText flex items-center gap-1 mb-1">
              <Cpu className="w-3 h-3 text-purple-600" />
              Est. Memory
            </div>
            <div className="text-base font-bold font-mono text-primaryText">
              {(metrics.estimatedMemoryBytes / 1024).toFixed(1)}{' '}
              <span className="text-xs font-normal text-secondaryText">KB</span>
            </div>
          </div>
        </div>

        {/* Current Cost Evaluation (A* / Dijkstra detail) */}
        {selectedAlgorithm === 'ASTAR' && currentSnapshot && (
          <div className="p-2.5 mb-3 bg-blue-50/60 border border-blue-100 rounded text-xs space-y-1">
            <div className="font-semibold text-primaryBlue flex items-center justify-between">
              <span>A* Evaluation Function</span>
              <span className="font-mono">f(n) = g(n) + h(n)</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[11px] text-primaryText text-center">
              <div className="bg-white p-1 rounded border border-blue-100">
                <span className="text-secondaryText block text-[10px]">g(n) Cost</span>
                {currentSnapshot.gCost ?? 0}
              </div>
              <div className="bg-white p-1 rounded border border-blue-100">
                <span className="text-secondaryText block text-[10px]">h(n) Heuristic</span>
                {currentSnapshot.hCost ?? 0}
              </div>
              <div className="bg-white p-1 rounded border border-blue-100 font-bold text-primaryBlue">
                <span className="text-secondaryText block text-[10px]">f(n) Total</span>
                {currentSnapshot.fCost ?? 0}
              </div>
            </div>
          </div>
        )}

        {/* Shortest Path Verification Note */}
        <div className="text-[11px] text-secondaryText bg-slate-50 border border-borders rounded p-2.5 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-secondaryText shrink-0 mt-0.5" />
          <span>
            {theory?.optimality ||
              'Evaluation verifies shortest paths on uniform-cost grids.'}
          </span>
        </div>
      </section>

      {/* Theoretical Asymptotics Summary Card */}
      <section className="bg-white border border-borders rounded p-4 shadow-xs">
        <h2 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-2.5">
          Asymptotic Bounds
        </h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-secondaryText">Time Complexity:</span>
            <span className="font-mono font-semibold text-primaryText">{theory?.timeComplexity}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-secondaryText">Auxiliary Space:</span>
            <span className="font-mono font-semibold text-primaryText">{theory?.spaceComplexity}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-secondaryText">Data Structure:</span>
            <span className="font-medium text-primaryText text-right text-[11px]">{theory?.dataStructures}</span>
          </div>
        </div>
      </section>
    </aside>
  );
};

