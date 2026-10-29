import { Grid, Point } from '../algorithms/types';
import { SeededRandom } from './seededRandom';

export interface MazeGenerationResult {
  grid: Grid;
  start: Point;
  goal: Point;
  seed: number;
}

/**
 * Recursive Backtracking Maze Generation (Iterative Stack implementation to prevent call-stack overflow on large grids).
 * Operates on an odd-dimensioned grid where cells at odd coordinates are maze rooms and walls sit in between.
 * Connects start (1, 1) and goal (rows - 2, cols - 2).
 */
export function generateRecursiveBacktrackingMaze(
  size: number,
  seed: number = Math.floor(Math.random() * 1000000)
): MazeGenerationResult {
  // Ensure size is odd for standard wall/corridor grid pattern
  const dimension = size % 2 === 0 ? size + 1 : size;
  const rows = dimension;
  const cols = dimension;

  // Initialize entire grid with WALL
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'WALL' as const)
  );

  const rng = new SeededRandom(seed);

  // Valid passage cell coordinates: odd rows and odd columns
  // Start at (1, 1)
  const start: Point = { row: 1, col: 1 };
  const goal: Point = { row: rows - 2, col: cols - 2 };

  grid[start.row][start.col] = 'PASSAGE';

  const stack: Point[] = [start];
  const visitedRooms = new Uint8Array(rows * cols);
  visitedRooms[start.row * cols + start.col] = 1;

  // Direction offsets jumping 2 cells (over a wall)
  const roomDirections = [
    { dr: -2, dc: 0, wallR: -1, wallC: 0 },
    { dr: 2, dc: 0, wallR: 1, wallC: 0 },
    { dr: 0, dc: -2, wallR: 0, wallC: -1 },
    { dr: 0, dc: 2, wallR: 0, wallC: 1 },
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    // Find unvisited neighbors 2 steps away
    const unvisitedNeighbors: { nextRoom: Point; wallCell: Point }[] = [];

    for (const dir of roomDirections) {
      const nr = current.row + dir.dr;
      const nc = current.col + dir.dc;

      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
        if (visitedRooms[nr * cols + nc] === 0) {
          unvisitedNeighbors.push({
            nextRoom: { row: nr, col: nc },
            wallCell: { row: current.row + dir.wallR, col: current.col + dir.wallC },
          });
        }
      }
    }

    if (unvisitedNeighbors.length > 0) {
      // Pick random neighbor
      const chosen = unvisitedNeighbors[rng.nextInt(0, unvisitedNeighbors.length - 1)];

      // Carve wall and destination room
      grid[chosen.wallCell.row][chosen.wallCell.col] = 'PASSAGE';
      grid[chosen.nextRoom.row][chosen.nextRoom.col] = 'PASSAGE';

      visitedRooms[chosen.nextRoom.row * cols + chosen.nextRoom.col] = 1;
      stack.push(chosen.nextRoom);
    } else {
      stack.pop();
    }
  }

  // Ensure goal is open and reachable
  grid[goal.row][goal.col] = 'PASSAGE';

  return {
    grid,
    start,
    goal,
    seed,
  };
}

