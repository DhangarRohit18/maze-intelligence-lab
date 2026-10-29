import React from 'react';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Sparkles,
  Shuffle,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useMazeStore } from '../../store/mazeStore';
import { AlgorithmType } from '../../algorithms/types';

export const ControlPanel: React.FC = () => {
  const {
    gridSize,
    setGridSize,
    seed,
    setSeed,
    generateMaze,
    selectedAlgorithm,
    setSelectedAlgorithm,
    playbackStatus,
    startVisualization,
    pauseVisualization,
    resumeVisualization,
    stepForward,
    resetVisualization,
    animationSpeed,
    setAnimationSpeed,
    showExplored,
    setShowExplored,
    showFrontier,
    setShowFrontier,
    showPath,
    setShowPath,
    runComparisonOnCurrentMaze,
  } = useMazeStore();

  const isRunning = playbackStatus === 'RUNNING';

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4">
      {/* Maze Generation Card */}
      <section className="bg-white border border-borders rounded p-4 shadow-xs">
        <h2 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primaryBlue" />
          Maze Configuration
        </h2>

        {/* Grid Dimensions */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-primaryText mb-1">
            Grid Dimensions (Odd Corridors)
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[15, 25, 35, 51].map((size) => (
              <button
                key={size}
                disabled={isRunning}
                onClick={() => setGridSize(size)}
                className={`py-1.5 text-xs font-medium border rounded transition-colors ${
                  gridSize === size
                    ? 'border-primaryBlue bg-blue-50 text-primaryBlue font-semibold'
                    : 'border-borders bg-white text-secondaryText hover:bg-slate-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Method */}
        <div className="mb-3">
          <span className="block text-xs font-medium text-primaryText mb-1">
            Generation Method
          </span>
          <div className="px-2.5 py-1.5 text-xs bg-slate-50 border border-borders rounded text-secondaryText font-mono">
            Recursive Backtracking (DFS Tree)
          </div>
        </div>

        {/* Seed Input & Regenerate */}
        <div className="mb-3">
          <label htmlFor="maze-seed-input" className="block text-xs font-medium text-primaryText mb-1">
            Random Seed (Reproducibility)
          </label>
          <div className="flex gap-2">
            <input
              id="maze-seed-input"
              type="number"
              disabled={isRunning}
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 text-xs border border-borders rounded bg-white text-primaryText focus:outline-none focus:border-primaryBlue font-mono disabled:opacity-50"
            />
            <button
              disabled={isRunning}
              onClick={() => generateMaze(seed)}
              title="Regenerate with exact seed"
              className="px-2.5 py-1.5 text-xs font-medium border border-borders bg-slate-50 hover:bg-slate-100 rounded text-primaryText disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Generate New Random Maze Button */}
        <button
          disabled={isRunning}
          onClick={() => generateMaze()}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-primaryText border border-borders rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5 text-secondaryTeal" />
          Generate New Random Maze
        </button>
      </section>

      {/* Solver & Playback Controls */}
      <section className="bg-white border border-borders rounded p-4 shadow-xs">
        <h2 className="text-xs font-semibold text-secondaryText uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-secondaryTeal" />
          Solver Execution
        </h2>

        {/* Algorithm Selection */}
        <div className="mb-3">
          <label htmlFor="algorithm-select" className="block text-xs font-medium text-primaryText mb-1">
            Pathfinding Algorithm
          </label>
          <select
            id="algorithm-select"
            disabled={isRunning}
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
            className="w-full px-2.5 py-1.5 text-xs border border-borders rounded bg-white text-primaryText font-medium focus:outline-none focus:border-primaryBlue disabled:opacity-50"
          >
            <option value="ASTAR">A* Search (Manhattan Heuristic)</option>
            <option value="BFS">Breadth-First Search (BFS - Shortest)</option>
            <option value="DIJKSTRA">Dijkstra's Algorithm (Min-Heap)</option>
            <option value="DFS">Depth-First Search (DFS - Exploratory)</option>
          </select>
        </div>

        {/* Execution Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {playbackStatus === 'RUNNING' ? (
            <button
              onClick={pauseVisualization}
              className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </button>
          ) : playbackStatus === 'PAUSED' ? (
            <button
              onClick={resumeVisualization}
              className="py-2 px-3 bg-primaryBlue hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Resume
            </button>
          ) : (
            <button
              onClick={startVisualization}
              className="py-2 px-3 bg-primaryBlue hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Start Search
            </button>
          )}

          <button
            onClick={stepForward}
            disabled={playbackStatus === 'RUNNING'}
            className="py-2 px-3 border border-borders bg-white hover:bg-slate-50 text-primaryText rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <StepForward className="w-3.5 h-3.5 text-secondaryText" />
            Next Step
          </button>
        </div>

        <button
          onClick={resetVisualization}
          className="w-full py-1.5 px-3 border border-borders bg-white hover:bg-slate-50 text-secondaryText rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors mb-4"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Search State
        </button>

        {/* Animation Speed Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-secondaryText mb-1">
            <span>Step Delay</span>
            <span className="font-mono text-primaryText">{animationSpeed} ms</span>
          </div>
          <input
            type="range"
            min="2"
            max="150"
            step="2"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primaryBlue"
          />
          <div className="flex justify-between text-[10px] text-secondaryText mt-1">
            <span>Fast (2ms)</span>
            <span>Slow (150ms)</span>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="pt-3 border-t border-borders">
          <span className="block text-xs font-medium text-primaryText mb-2 flex items-center gap-1">
            <Eye className="w-3 h-3 text-secondaryText" />
            Visualization Overlays
          </span>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-primaryText cursor-pointer">
              <input
                type="checkbox"
                checked={showExplored}
                onChange={(e) => setShowExplored(e.target.checked)}
                className="rounded border-borders text-primaryBlue focus:ring-0"
              />
              <span>Show Explored Closed Set</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-primaryText cursor-pointer">
              <input
                type="checkbox"
                checked={showFrontier}
                onChange={(e) => setShowFrontier(e.target.checked)}
                className="rounded border-borders text-primaryBlue focus:ring-0"
              />
              <span>Show Active Frontier (Open Set)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-primaryText cursor-pointer">
              <input
                type="checkbox"
                checked={showPath}
                onChange={(e) => setShowPath(e.target.checked)}
                className="rounded border-borders text-primaryBlue focus:ring-0"
              />
              <span>Show Reconstructed Path</span>
            </label>
          </div>
        </div>

        {/* Run Comparison On Current Maze */}
        <div className="mt-4 pt-3 border-t border-borders">
          <button
            disabled={isRunning}
            onClick={runComparisonOnCurrentMaze}
            className="w-full py-2 px-3 bg-secondaryTeal hover:bg-teal-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Evaluate All 4 Algorithms
          </button>
        </div>
      </section>
    </aside>
  );
};

