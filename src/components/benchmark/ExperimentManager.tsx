import React, { useState } from 'react';
import { useMazeStore } from '../../store/mazeStore';
import { exportTrialsToCSV } from '../../report/csvExport';
import { Play, Download, StopCircle, RefreshCw, BarChart2 } from 'lucide-react';

export const ExperimentManager: React.FC = () => {
  const {
    isBenchmarking,
    benchmarkProgress,
    benchmarkTrials,
    benchmarkAggregates,
    runBenchmarks,
    cancelBenchmark,
  } = useMazeStore();

  const [testSize, setTestSize] = useState<number>(25);
  const [numTrials, setNumTrials] = useState<number>(10);

  const handleStart = () => {
    runBenchmarks([testSize], numTrials);
  };

  const percentComplete = benchmarkProgress
    ? Math.round((benchmarkProgress.completed / benchmarkProgress.total) * 100)
    : 0;

  return (
    <section className="bg-white border border-borders rounded p-4 shadow-xs mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-borders">
        <div>
          <h2 className="text-sm font-semibold text-primaryText flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-primaryBlue" />
            Empirical Experiment Runner & Statistical Aggregator
          </h2>
          <p className="text-xs text-secondaryText">
            Conduct multi-trial benchmarks across randomized seeds using Web Workers off the main thread.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {benchmarkTrials.length > 0 && (
            <button
              onClick={() => exportTrialsToCSV(benchmarkTrials)}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-borders rounded text-primaryText transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-secondaryTeal" />
              Export CSV Dataset
            </button>
          )}

          {isBenchmarking ? (
            <button
              onClick={cancelBenchmark}
              className="px-3 py-1.5 text-xs font-medium bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors flex items-center gap-1.5"
            >
              <StopCircle className="w-3.5 h-3.5" />
              Cancel Benchmark
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-3 py-1.5 text-xs font-medium bg-primaryBlue hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Run Empirical Suite
            </button>
          )}
        </div>
      </div>

      {/* Configuration row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block font-medium text-primaryText mb-1">Grid Dimension</label>
          <select
            disabled={isBenchmarking}
            value={testSize}
            onChange={(e) => setTestSize(parseInt(e.target.value))}
            className="w-full px-2.5 py-1.5 border border-borders rounded bg-white text-primaryText disabled:opacity-50"
          >
            <option value={15}>15 × 15 Grid (Small)</option>
            <option value={25}>25 × 25 Grid (Standard)</option>
            <option value={35}>35 × 35 Grid (Medium)</option>
            <option value={51}>51 × 51 Grid (Large Benchmark)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-primaryText mb-1">Maze Seeds per Algorithm</label>
          <select
            disabled={isBenchmarking}
            value={numTrials}
            onChange={(e) => setNumTrials(parseInt(e.target.value))}
            className="w-full px-2.5 py-1.5 border border-borders rounded bg-white text-primaryText disabled:opacity-50"
          >
            <option value={5}>5 Repetitions (Quick)</option>
            <option value={10}>10 Repetitions (Standard)</option>
            <option value={25}>25 Repetitions (Rigorous)</option>
            <option value={50}>50 Repetitions (Statistical)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-primaryText mb-1">Execution Architecture</label>
          <div className="px-2.5 py-1.5 bg-slate-50 border border-borders rounded text-secondaryText font-mono">
            Dedicated Web Worker (Non-blocking)
          </div>
        </div>
      </div>

      {/* Progress Bar if active */}
      {isBenchmarking && benchmarkProgress && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3 text-xs">
          <div className="flex justify-between font-medium text-primaryBlue mb-1.5">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Running Multi-Algorithm Benchmark Suite...
            </span>
            <span>
              {benchmarkProgress.completed} / {benchmarkProgress.total} trials ({percentComplete}%)
            </span>
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primaryBlue h-full transition-all duration-200"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      )}

      {/* Aggregated Statistical Table */}
      {benchmarkAggregates ? (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borders bg-slate-50 text-secondaryText">
                <th className="py-2 px-3 font-semibold">Algorithm</th>
                <th className="py-2 px-3 font-semibold">Completed Trials</th>
                <th className="py-2 px-3 font-semibold">Mean Runtime (ms)</th>
                <th className="py-2 px-3 font-semibold">Median Runtime (ms)</th>
                <th className="py-2 px-3 font-semibold">Avg Explored Vertices</th>
                <th className="py-2 px-3 font-semibold">Avg Path Length</th>
                <th className="py-2 px-3 font-semibold">Avg Memory (KB)</th>
                <th className="py-2 px-3 font-semibold">Optimality Guaranteed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borders">
              {Object.values(benchmarkAggregates).map((agg) => (
                <tr key={agg.algorithm} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-semibold text-primaryText">{agg.algorithm}</td>
                  <td className="py-2 px-3 font-mono">{agg.trialsCount}</td>
                  <td className="py-2 px-3 font-mono">{agg.avgRuntimeMs}</td>
                  <td className="py-2 px-3 font-mono">{agg.medianRuntimeMs}</td>
                  <td className="py-2 px-3 font-mono">{agg.avgExpandedNodes}</td>
                  <td className="py-2 px-3 font-mono">{agg.avgPathLength}</td>
                  <td className="py-2 px-3 font-mono">{(agg.avgMemoryBytes / 1024).toFixed(1)}</td>
                  <td className="py-2 px-3">
                    {agg.shortestPathGuaranteed ? (
                      <span className="text-emerald-700 font-medium">Guaranteed</span>
                    ) : (
                      <span className="text-amber-700 font-medium">Suboptimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-secondaryText border border-dashed border-borders rounded">
          No repeated benchmark has been run yet. Select your configuration and click "Run Empirical Suite" above.
        </div>
      )}
    </section>
  );
};

