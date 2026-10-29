import { AlgorithmResult, Grid, Point, StepSnapshot } from './types';
import { PriorityQueue } from './priorityQueue';
import { getOrthogonalNeighbors, pointKey, reconstructPath } from './pathReconstruction';

export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function euclideanDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
}

export function runAStar(
  grid: Grid,
  start: Point,
  goal: Point,
  recordSnapshots: boolean = false,
  heuristicFn: (a: Point, b: Point) => number = manhattanDistance,
  weights?: number[][]
): AlgorithmResult {
  const rows = grid.length;
  const cols = grid[0].length;

  const startTime = performance.now();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, Point>();
  const finalized = new Set<string>();

  const pq = new PriorityQueue<Point>();

  const startKey = pointKey(start);
  gScore.set(startKey, 0);
  const startF = heuristicFn(start, goal);
  fScore.set(startKey, startF);

  pq.enqueue(start, startF);

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

    const currG = gScore.get(cKey) ?? Infinity;
    const currH = heuristicFn(current, goal);

    if (recordSnapshots) {
      snapshots.push({
        current,
        explored: [...exploredOrder],
        frontier: [],
        expandedCount: expandedNodes,
        discoveredCount: discoveredNodes,
        frontierSize: pq.size(),
        status: 'Running',
        gCost: currG,
        hCost: currH,
        fCost: currG + currH,
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

      if (finalized.has(nKey)) continue;

      const edgeWeight = weights ? weights[neighbor.row][neighbor.col] : 1;
      const tentativeG = currG + edgeWeight;

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        if (!gScore.has(nKey)) {
          discoveredNodes++;
        }
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentativeG);
        const h = heuristicFn(neighbor, goal);
        const f = tentativeG + h;
        fScore.set(nKey, f);
        pq.enqueue(neighbor, f);
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
    (gScore.size * 40) +
    (fScore.size * 40) +
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

