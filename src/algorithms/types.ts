export type AlgorithmType = 'DFS' | 'BFS' | 'DIJKSTRA' | 'ASTAR';

export type CellType = 'WALL' | 'PASSAGE';

export interface Point {
  row: number;
  col: number;
}

export type Grid = CellType[][];

export interface AlgorithmMetrics {
  executionTimeMs: number;
  expandedNodes: number;
  discoveredNodes: number;
  maxFrontierSize: number;
  pathLength: number | null;
  estimatedMemoryBytes: number;
  status: 'Ready' | 'Running' | 'Paused' | 'Completed' | 'No Path' | 'Cancelled';
  operationsCount?: number;
}

export interface StepSnapshot {
  current?: Point;
  explored: Point[];
  frontier: Point[];
  path?: Point[];
  expandedCount: number;
  discoveredCount: number;
  frontierSize: number;
  status: 'Running' | 'Completed' | 'No Path';
  fCost?: number;
  gCost?: number;
  hCost?: number;
}

export interface AlgorithmResult {
  path: Point[];
  exploredOrder: Point[];
  snapshots: StepSnapshot[];
  metrics: AlgorithmMetrics;
  found: boolean;
}

export interface BenchmarkTrial {
  algorithm: AlgorithmType;
  gridSize: number;
  seed: number;
  runtimeMs: number;
  expandedNodes: number;
  discoveredNodes: number;
  maxFrontierSize: number;
  pathLength: number | null;
  estimatedMemoryBytes: number;
  isOptimal: boolean;
  status: string;
}

export interface BenchmarkAggregate {
  algorithm: AlgorithmType;
  trialsCount: number;
  avgRuntimeMs: number;
  medianRuntimeMs: number;
  avgExpandedNodes: number;
  avgPathLength: number;
  avgMemoryBytes: number;
  shortestPathGuaranteed: boolean;
}

