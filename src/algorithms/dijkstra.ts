import { AlgorithmResult, Grid, Point, StepSnapshot } from './types';
import { PriorityQueue } from './priorityQueue';
import { getOrthogonalNeighbors, pointKey, reconstructPath } from './pathReconstruction';

export function runDijkstra(
  grid: Grid,
  start: Point,
  goal: Point,
  recordSnapshots: boolean = false,
  weights?: number[][]
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;

  const startTime = performance.now();

  const dist = new Map<string, number>();
  const cameFrom = new Map<string, Point>();
  const finalized = new Set<string>();

  const pq = new PriorityQueue<Point>();

  const startKey = pointKey(start);
  dist.set(startKey, 0);
  pq.enqueue(start, 0);

  let expandedNodes = 0;
  let discoveredNodes = 1;
  let maxFrontierSize = 1;
  let found = false;

  const exploredOrder: Point[] = [];
  const snapshots: StepSnapshot[] = [];
  let operationsCount = 0;

  while (!pq.isEmpty()) {
    maxFrontierSize = Math.max(maxFrontierSize, pq.size());

    const current = pq.dequeue()!;
    const cKey = pointKey(current);

    if (finalized.has(cKey)) {
      continue;
    }
    finalized.add(cKey);

    operationsCount++;
    expandedNodes++;
    exploredOrder.push(current);

    if (recordSnapshots) {
      snapshots.push({
        current,
        explored: [...exploredOrder],
        frontier: [], // Heap contents
        expandedCount: expandedNodes,
        discoveredCount: discoveredNodes,
        frontierSize: pq.size(),
        status: 'Running',
        gCost: dist.get(cKey),
      });
    }

    if (current.row === goal.row && current.col === goal.col) {
      found = true;
      break;
    }

    const currentDist = dist.get(cKey) ?? Infinity;
    const neighbors = getOrthogonalNeighbors(current, rows, cols, grid);

    for (const neighbor of neighbors) {
      const nKey = pointKey(neighbor);
      operationsCount++;

      if (finalized.has(nKey)) continue;

      const edgeWeight = weights ? weights[neighbor.row][neighbor.col] : 1;
      const tentativeDist = currentDist + edgeWeight;

      if (tentativeDist < (dist.get(nKey) ?? Infinity)) {
        if (!dist.has(nKey)) {
          discoveredNodes++;
        }
        dist.set(nKey, tentativeDist);
        cameFrom.set(nKey, current);
        pq.enqueue(neighbor, tentativeDist);
      }
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 1000) / 1000;

  let path: Point[] = [];
  if (found) {
    path = reconstructPath(cameFrom, goal);
  }

  // Estimated memory: Map (dist, cameFrom) + Set (finalized) + Heap elements
  const estimatedMemoryBytes =
    (dist.size * 40) +
    (cameFrom.size * 48) +
    (finalized.size * 32) +
    (pq.size() * 32) +
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

