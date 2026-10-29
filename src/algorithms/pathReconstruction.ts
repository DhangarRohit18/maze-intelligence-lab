import { Point } from './types';

export function reconstructPath(
  cameFrom: Map<string, Point>,
  current: Point,
  keyFn: (p: Point) => string = (p) => `${p.row},${p.col}`
): Point[] {
  const totalPath: Point[] = [current];
  let currKey = keyFn(current);

  while (cameFrom.has(currKey)) {
    const prev = cameFrom.get(currKey)!;
    totalPath.push(prev);
    currKey = keyFn(prev);
  }

  return totalPath.reverse();
}

export function pointKey(p: Point): string {
  return `${p.row},${p.col}`;
}

export function parsePointKey(key: string): Point {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
}

export function getOrthogonalNeighbors(
  p: Point,
  rows: number,
  cols: number,
  grid: ('WALL' | 'PASSAGE')[][]
): Point[] {
  const neighbors: Point[] = [];
  const dirs = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (const d of dirs) {
    const nr = p.row + d.row;
    const nc = p.col + d.col;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (grid[nr][nc] === 'PASSAGE') {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }

  return neighbors;
}

