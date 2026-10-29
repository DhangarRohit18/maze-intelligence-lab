import { AlgorithmType, BenchmarkTrial, BenchmarkAggregate } from '../algorithms/types';
import { generateRecursiveBacktrackingMaze } from '../generator/recursiveBacktracking';
import { runAlgorithm } from '../algorithms';

export function runBenchmarkSuite(
  algorithms: AlgorithmType[],
  gridSize: number,
  seeds: number[],
  onProgress?: (completed: number, total: number) => void
): { trials: BenchmarkTrial[]; aggregates: Record<AlgorithmType, BenchmarkAggregate> } {
  const trials: BenchmarkTrial[] = [];
  const total = algorithms.length * seeds.length;
  let completed = 0;

  for (const seed of seeds) {
    const maze = generateRecursiveBacktrackingMaze(gridSize, seed);

    for (const algo of algorithms) {
      // Warm up JIT for very tiny benchmark run
      const result = runAlgorithm(algo, maze.grid, maze.start, maze.goal, false);

      trials.push({
        algorithm: algo,
        gridSize,
        seed,
        runtimeMs: result.metrics.executionTimeMs,
        expandedNodes: result.metrics.expandedNodes,
        discoveredNodes: result.metrics.discoveredNodes,
        maxFrontierSize: result.metrics.maxFrontierSize,
        pathLength: result.metrics.pathLength,
        estimatedMemoryBytes: result.metrics.estimatedMemoryBytes,
        isOptimal: algo !== 'DFS',
        status: result.metrics.status,
      });

      completed++;
      if (onProgress) {
        onProgress(completed, total);
      }
    }
  }

  // Calculate Aggregates
  const aggregates = {} as Record<AlgorithmType, BenchmarkAggregate>;

  for (const algo of algorithms) {
    const algoTrials = trials.filter((t) => t.algorithm === algo && t.status === 'Completed');
    if (algoTrials.length === 0) continue;

    const runtimes = algoTrials.map((t) => t.runtimeMs).sort((a, b) => a - b);
    const medianRuntimeMs =
      runtimes.length % 2 === 0
        ? (runtimes[runtimes.length / 2 - 1] + runtimes[runtimes.length / 2]) / 2
        : runtimes[Math.floor(runtimes.length / 2)];

    const avgRuntimeMs =
      runtimes.reduce((acc, val) => acc + val, 0) / algoTrials.length;
    const avgExpandedNodes =
      algoTrials.reduce((acc, t) => acc + t.expandedNodes, 0) / algoTrials.length;
    const avgPathLength =
      algoTrials.reduce((acc, t) => acc + (t.pathLength ?? 0), 0) / algoTrials.length;
    const avgMemoryBytes =
      algoTrials.reduce((acc, t) => acc + t.estimatedMemoryBytes, 0) / algoTrials.length;

    aggregates[algo] = {
      algorithm: algo,
      trialsCount: algoTrials.length,
      avgRuntimeMs: Math.round(avgRuntimeMs * 1000) / 1000,
      medianRuntimeMs: Math.round(medianRuntimeMs * 1000) / 1000,
      avgExpandedNodes: Math.round(avgExpandedNodes),
      avgPathLength: Math.round(avgPathLength * 10) / 10,
      avgMemoryBytes: Math.round(avgMemoryBytes),
      shortestPathGuaranteed: algo !== 'DFS',
    };
  }

  return { trials, aggregates };
}

