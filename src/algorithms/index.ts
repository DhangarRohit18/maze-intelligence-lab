import { AlgorithmResult, AlgorithmType, Grid, Point } from './types';
import { runDFS } from './dfs';
import { runBFS } from './bfs';
import { runDijkstra } from './dijkstra';
import { runAStar } from './astar';

export function runAlgorithm(
  type: AlgorithmType,
  grid: Grid,
  start: Point,
  goal: Point,
  recordSnapshots: boolean = false,
  weights?: number[][]
): AlgorithmResult {
  switch (type) {
    case 'DFS':
      return runDFS(grid, start, goal, recordSnapshots);
    case 'BFS':
      return runBFS(grid, start, goal, recordSnapshots);
    case 'DIJKSTRA':
      return runDijkstra(grid, start, goal, recordSnapshots, weights);
    case 'ASTAR':
      return runAStar(grid, start, goal, recordSnapshots, undefined, weights);
  }
}

