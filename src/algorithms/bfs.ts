import { AlgorithmResult, Grid, Point, StepSnapshot } from './types';
import { getOrthogonalNeighbors, pointKey, reconstructPath } from './pathReconstruction';

export function runBFS(
  grid: Grid,
  start: Point,
  goal: Point,
  recordSnapshots: boolean = false
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;

  const startTime = performance.now();

  const visited = new Set<string>();
  const cameFrom = new Map<string, Point>();
  const queue: Point[] = [start];
  visited.add(pointKey(start));

  let head = 0; // efficient queue indexing
  let expandedNodes = 0;
  let discoveredNodes = 1;
  let maxFrontierSize = 1;
  let found = false;

  const exploredOrder: Point[] = [];
  const snapshots: StepSnapshot[] = [];
  let operationsCount = 0;

  while (head < queue.length) {
    const currentFrontierSize = queue.length - head;
    maxFrontierSize = Math.max(maxFrontierSize, currentFrontierSize);

    const current = queue[head++];
    operationsCount++;
    expandedNodes++;
    exploredOrder.push(current);

    if (recordSnapshots) {
      snapshots.push({
        current,
        explored: [...exploredOrder],
        frontier: queue.slice(head),
        expandedCount: expandedNodes,
        discoveredCount: discoveredNodes,
        frontierSize: currentFrontierSize,
        status: 'Running',
      });
    }

    if (current.row === goal.row && current.col === goal.col) {
      found = true;
      break;
    }

    const neighbors = getOrthogonalNeighbors(current, rows, cols, grid);
    for (const neighbor of neighbors) {
      const nKey = pointKey(neighbor);
      operationsCount++;
      if (!visited.has(nKey)) {
        visited.add(nKey);
        cameFrom.set(nKey, current);
        queue.push(neighbor);
        discoveredNodes++;
      }
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 1000) / 1000;

  let path: Point[] = [];
  if (found) {
    path = reconstructPath(cameFrom, goal);
  }

  const estimatedMemoryBytes =
    (visited.size * 32) +
    (cameFrom.size * 48) +
    (queue.length * 24) +
    (exploredOrder.length * 24);

  if (recordSnapshots && found) {
    snapshots.push({
      current: goal,
      explored: [...exploredOrder],
      frontier: [],
      path,
      expandedCount: expandedNodes,
      discoveredCount: discoveredNodes,
      frontierSize: 0,
      status: 'Completed',
    });
  }

  return {
    path,
    exploredOrder,
    snapshots,
    found,
    metrics: {
      executionTimeMs,
      expandedNodes,
      discoveredNodes,
      maxFrontierSize,
      pathLength: found ? path.length : null,
      estimatedMemoryBytes,
      status: found ? 'Completed' : 'No Path',
      operationsCount,
    },
  };
}

