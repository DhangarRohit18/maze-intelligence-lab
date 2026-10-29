import { create } from 'zustand';
import {
  AlgorithmMetrics,
  AlgorithmResult,
  AlgorithmType,
  BenchmarkAggregate,
  BenchmarkTrial,
  Grid,
  Point,
  StepSnapshot,
} from '../algorithms/types';
import { generateRecursiveBacktrackingMaze } from '../generator/recursiveBacktracking';
import { runAlgorithm } from '../algorithms';

export interface MazeStoreState {
  // Grid & Maze configuration
  gridSize: number;
  seed: number;
  grid: Grid;
  start: Point;
  goal: Point;

  // Algorithm selection & Execution
  selectedAlgorithm: AlgorithmType;
  metrics: AlgorithmMetrics;
  comparisonResults: Record<AlgorithmType, AlgorithmMetrics | null>;

  // Step-by-step visualization playback state
  playbackStatus: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  snapshots: StepSnapshot[];
  currentSnapshotIndex: number;
  currentSnapshot: StepSnapshot | null;
  animationSpeed: number; // ms per step

  // Display toggles
  showExplored: boolean;
  showFrontier: boolean;
  showPath: boolean;

  // Repeated Experiments / Benchmarks
  benchmarkTrials: BenchmarkTrial[];
  benchmarkAggregates: Record<AlgorithmType, BenchmarkAggregate> | null;
  isBenchmarking: boolean;
  benchmarkProgress: { completed: number; total: number } | null;

  // Actions
  setGridSize: (size: number) => void;
  setSeed: (seed: number) => void;
  generateMaze: (customSeed?: number) => void;
  setSelectedAlgorithm: (algo: AlgorithmType) => void;
  setAnimationSpeed: (speed: number) => void;
  setShowExplored: (show: boolean) => void;
  setShowFrontier: (show: boolean) => void;
  setShowPath: (show: boolean) => void;

  setCustomStart: (p: Point) => void;
  setCustomGoal: (p: Point) => void;

  startVisualization: () => void;
  pauseVisualization: () => void;
  resumeVisualization: () => void;
  stepForward: () => void;
  resetVisualization: () => void;

  runComparisonOnCurrentMaze: () => void;
  runBenchmarks: (sizes: number[], numSeeds: number) => void;
  cancelBenchmark: () => void;
}

const initialSize = 25;
const initialSeed = 42;
const initialMaze = generateRecursiveBacktrackingMaze(initialSize, initialSeed);

const initialMetrics: AlgorithmMetrics = {
  executionTimeMs: 0,
  expandedNodes: 0,
  discoveredNodes: 0,
  maxFrontierSize: 0,
  pathLength: null,
  estimatedMemoryBytes: 0,
  status: 'Ready',
};

let playbackTimer: ReturnType<typeof setTimeout> | null = null;
let activeWorker: Worker | null = null;

export const useMazeStore = create<MazeStoreState>((set, get) => ({
  gridSize: initialSize,
  seed: initialSeed,
  grid: initialMaze.grid,
  start: initialMaze.start,
  goal: initialMaze.goal,

  selectedAlgorithm: 'ASTAR',
  metrics: initialMetrics,
  comparisonResults: {
    DFS: null,
    BFS: null,
    DIJKSTRA: null,
    ASTAR: null,
  },

  playbackStatus: 'IDLE',
  snapshots: [],
  currentSnapshotIndex: 0,
  currentSnapshot: null,
  animationSpeed: 25, // default ms delay

  showExplored: true,
  showFrontier: true,
  showPath: true,

  benchmarkTrials: [],
  benchmarkAggregates: null,
  isBenchmarking: false,
  benchmarkProgress: null,

  setGridSize: (size: number) => {
    const s = get();
    if (s.playbackStatus === 'RUNNING') {
      s.resetVisualization();
    }
    const newMaze = generateRecursiveBacktrackingMaze(size, s.seed);
    set({
      gridSize: size,
      grid: newMaze.grid,
      start: newMaze.start,
      goal: newMaze.goal,
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
      comparisonResults: { DFS: null, BFS: null, DIJKSTRA: null, ASTAR: null },
    });
  },

  setSeed: (seed: number) => {
    set({ seed });
  },

  generateMaze: (customSeed?: number) => {
    const s = get();
    if (s.playbackStatus === 'RUNNING') {
      s.resetVisualization();
    }
    const seed = customSeed !== undefined ? customSeed : Math.floor(Math.random() * 1000000);
    const newMaze = generateRecursiveBacktrackingMaze(s.gridSize, seed);
    set({
      seed,
      grid: newMaze.grid,
      start: newMaze.start,
      goal: newMaze.goal,
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
      comparisonResults: { DFS: null, BFS: null, DIJKSTRA: null, ASTAR: null },
    });
  },

  setSelectedAlgorithm: (algo: AlgorithmType) => {
    const s = get();
    if (s.playbackStatus === 'RUNNING') {
      s.resetVisualization();
    }
    set({
      selectedAlgorithm: algo,
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
    });
  },

  setAnimationSpeed: (speed: number) => {
    set({ animationSpeed: speed });
  },

  setShowExplored: (show: boolean) => set({ showExplored: show }),
  setShowFrontier: (show: boolean) => set({ showFrontier: show }),
  setShowPath: (show: boolean) => set({ showPath: show }),

  setCustomStart: (p: Point) => {
    const s = get();
    if (s.playbackStatus === 'RUNNING') return;
    if (s.grid[p.row][p.col] === 'WALL') return;
    set({
      start: p,
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
    });
  },

  setCustomGoal: (p: Point) => {
    const s = get();
    if (s.playbackStatus === 'RUNNING') return;
    if (s.grid[p.row][p.col] === 'WALL') return;
    set({
      goal: p,
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
    });
  },

  startVisualization: () => {
    const s = get();
    if (playbackTimer) {
      clearTimeout(playbackTimer);
      playbackTimer = null;
    }

    // Run algorithm and generate step snapshots
    const result: AlgorithmResult = runAlgorithm(
      s.selectedAlgorithm,
      s.grid,
      s.start,
      s.goal,
      true
    );

    if (result.snapshots.length === 0) {
      set({
        metrics: result.metrics,
        playbackStatus: 'COMPLETED',
      });
      return;
    }

    set({
      snapshots: result.snapshots,
      currentSnapshotIndex: 0,
      currentSnapshot: result.snapshots[0],
      playbackStatus: 'RUNNING',
      metrics: {
        ...result.metrics,
        status: 'Running',
        pathLength: null, // Pending until finished
      },
    });

    const stepFn = () => {
      const state = get();
      if (state.playbackStatus !== 'RUNNING') return;

      const nextIdx = state.currentSnapshotIndex + 1;
      if (nextIdx < state.snapshots.length) {
        const snap = state.snapshots[nextIdx];
        set({
          currentSnapshotIndex: nextIdx,
          currentSnapshot: snap,
          metrics: {
            ...state.metrics,
            expandedNodes: snap.expandedCount,
            discoveredNodes: snap.discoveredCount,
            maxFrontierSize: Math.max(state.metrics.maxFrontierSize, snap.frontierSize),
          },
        });
        playbackTimer = setTimeout(stepFn, state.animationSpeed);
      } else {
        // Finished
        set({
          playbackStatus: 'COMPLETED',
          metrics: result.metrics,
        });
        playbackTimer = null;
      }
    };

    playbackTimer = setTimeout(stepFn, s.animationSpeed);
  },

  pauseVisualization: () => {
    if (playbackTimer) {
      clearTimeout(playbackTimer);
      playbackTimer = null;
    }
    const s = get();
    set({
      playbackStatus: 'PAUSED',
      metrics: { ...s.metrics, status: 'Paused' },
    });
  },

  resumeVisualization: () => {
    const s = get();
    if (s.playbackStatus !== 'PAUSED') return;

    set({
      playbackStatus: 'RUNNING',
      metrics: { ...s.metrics, status: 'Running' },
    });

    const stepFn = () => {
      const state = get();
      if (state.playbackStatus !== 'RUNNING') return;

      const nextIdx = state.currentSnapshotIndex + 1;
      if (nextIdx < state.snapshots.length) {
        const snap = state.snapshots[nextIdx];
        set({
          currentSnapshotIndex: nextIdx,
          currentSnapshot: snap,
          metrics: {
            ...state.metrics,
            expandedNodes: snap.expandedCount,
            discoveredNodes: snap.discoveredCount,
            maxFrontierSize: Math.max(state.metrics.maxFrontierSize, snap.frontierSize),
          },
        });
        playbackTimer = setTimeout(stepFn, state.animationSpeed);
      } else {
        set({
          playbackStatus: 'COMPLETED',
          metrics: { ...state.metrics, status: 'Completed' },
        });
        playbackTimer = null;
      }
    };

    playbackTimer = setTimeout(stepFn, s.animationSpeed);
  },

  stepForward: () => {
    const s = get();
    if (playbackTimer) {
      clearTimeout(playbackTimer);
      playbackTimer = null;
    }

    if (s.snapshots.length === 0) {
      // Initialize snapshots first if not done
      const result = runAlgorithm(s.selectedAlgorithm, s.grid, s.start, s.goal, true);
      set({
        snapshots: result.snapshots,
        currentSnapshotIndex: 0,
        currentSnapshot: result.snapshots[0],
        playbackStatus: 'PAUSED',
        metrics: { ...result.metrics, status: 'Paused' },
      });
      return;
    }

    const nextIdx = s.currentSnapshotIndex + 1;
    if (nextIdx < s.snapshots.length) {
      const snap = s.snapshots[nextIdx];
      set({
        currentSnapshotIndex: nextIdx,
        currentSnapshot: snap,
        playbackStatus: 'PAUSED',
        metrics: {
          ...s.metrics,
          status: 'Paused',
          expandedNodes: snap.expandedCount,
          discoveredNodes: snap.discoveredCount,
          maxFrontierSize: Math.max(s.metrics.maxFrontierSize, snap.frontierSize),
        },
      });
    } else {
      set({
        playbackStatus: 'COMPLETED',
        metrics: { ...s.metrics, status: 'Completed' },
      });
    }
  },

  resetVisualization: () => {
    if (playbackTimer) {
      clearTimeout(playbackTimer);
      playbackTimer = null;
    }
    set({
      playbackStatus: 'IDLE',
      snapshots: [],
      currentSnapshotIndex: 0,
      currentSnapshot: null,
      metrics: initialMetrics,
    });
  },

  runComparisonOnCurrentMaze: () => {
    const s = get();
    const algos: AlgorithmType[] = ['DFS', 'BFS', 'DIJKSTRA', 'ASTAR'];
    const compResults: Record<AlgorithmType, AlgorithmMetrics | null> = {
      DFS: null,
      BFS: null,
      DIJKSTRA: null,
      ASTAR: null,
    };

    for (const algo of algos) {
      // Execute each without animation overhead
      const res = runAlgorithm(algo, s.grid, s.start, s.goal, false);
      compResults[algo] = res.metrics;
    }

    set({ comparisonResults: compResults });
  },

  runBenchmarks: (sizes: number[], numSeeds: number) => {
    const s = get();
    if (s.isBenchmarking) return;

    set({
      isBenchmarking: true,
      benchmarkProgress: { completed: 0, total: 4 * sizes.length * numSeeds },
    });

    const seeds = Array.from({ length: numSeeds }, (_, i) => 1000 + i * 37);
    const algos: AlgorithmType[] = ['DFS', 'BFS', 'DIJKSTRA', 'ASTAR'];

    // Instantiate worker
    try {
      activeWorker = new Worker(
        new URL('../benchmark/benchmark.worker.ts', import.meta.url),
        { type: 'module' }
      );

      activeWorker.onmessage = (e: MessageEvent) => {
        const { type, completed, total, data, error } = e.data;
        if (type === 'PROGRESS') {
          set({ benchmarkProgress: { completed, total } });
        } else if (type === 'COMPLETE') {
          set({
            benchmarkTrials: data.trials,
            benchmarkAggregates: data.aggregates,
            isBenchmarking: false,
            benchmarkProgress: null,
          });
          if (activeWorker) {
            activeWorker.terminate();
            activeWorker = null;
          }
        } else if (type === 'ERROR') {
          console.error('Benchmark Worker Error:', error);
          set({ isBenchmarking: false, benchmarkProgress: null });
          if (activeWorker) {
            activeWorker.terminate();
            activeWorker = null;
          }
        }
      };

      // Send start message for primary size
      activeWorker.postMessage({
        algorithms: algos,
        gridSize: sizes[0] || s.gridSize,
        seeds,
      });
    } catch (e) {
      console.warn('Web Worker fallback to synchronous benchmarking:', e);
      // Fallback in case worker is restricted in preview
      import('../benchmark/runner').then(({ runBenchmarkSuite }) => {
        const result = runBenchmarkSuite(algos, s.gridSize, seeds, (completed, total) => {
          set({ benchmarkProgress: { completed, total } });
        });
        set({
          benchmarkTrials: result.trials,
          benchmarkAggregates: result.aggregates,
          isBenchmarking: false,
          benchmarkProgress: null,
        });
      });
    }
  },

  cancelBenchmark: () => {
    if (activeWorker) {
      activeWorker.terminate();
      activeWorker = null;
    }
    set({ isBenchmarking: false, benchmarkProgress: null });
  },
}));

