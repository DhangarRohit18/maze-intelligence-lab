import { describe, it, expect } from 'vitest';
import { generateRecursiveBacktrackingMaze } from '../generator/recursiveBacktracking';
import { runDFS } from '../algorithms/dfs';
import { runBFS } from '../algorithms/bfs';
import { runDijkstra } from '../algorithms/dijkstra';
import { runAStar } from '../algorithms/astar';
import { Grid, Point } from '../algorithms/types';

describe('Maze Generator & Pathfinding Correctness', () => {
  it('generates reproducible mazes with the same seed', () => {
    const seed = 12345;
    const maze1 = generateRecursiveBacktrackingMaze(15, seed);
    const maze2 = generateRecursiveBacktrackingMaze(15, seed);

    expect(maze1.grid).toEqual(maze2.grid);
    expect(maze1.start).toEqual(maze2.start);
    expect(maze1.goal).toEqual(maze2.goal);
  });

  it('guarantees start and goal are passages', () => {
    const maze = generateRecursiveBacktrackingMaze(25, 42);
    expect(maze.grid[maze.start.row][maze.start.col]).toBe('PASSAGE');
    expect(maze.grid[maze.goal.row][maze.goal.col]).toBe('PASSAGE');
  });

  it('verifies that BFS, Dijkstra, and A* find equal shortest paths on uniform grid', () => {
    const maze = generateRecursiveBacktrackingMaze(21, 999);
    const bfsRes = runBFS(maze.grid, maze.start, maze.goal);
    const dijkstraRes = runDijkstra(maze.grid, maze.start, maze.goal);
    const astarRes = runAStar(maze.grid, maze.start, maze.goal);

    expect(bfsRes.found).toBe(true);
    expect(dijkstraRes.found).toBe(true);
    expect(astarRes.found).toBe(true);

    // BFS, Dijkstra and A* (admissible Manhattan) must yield the exact same shortest path length
    expect(bfsRes.metrics.pathLength).toBe(dijkstraRes.metrics.pathLength);
    expect(dijkstraRes.metrics.pathLength).toBe(astarRes.metrics.pathLength);
  });

  it('verifies that DFS finds a valid path from start to goal without cutting walls', () => {
    const maze = generateRecursiveBacktrackingMaze(21, 777);
    const dfsRes = runDFS(maze.grid, maze.start, maze.goal);

    expect(dfsRes.found).toBe(true);
    expect(dfsRes.path.length).toBeGreaterThan(0);
    expect(dfsRes.path[0]).toEqual(maze.start);
    expect(dfsRes.path[dfsRes.path.length - 1]).toEqual(maze.goal);

    // Check path continuity and no wall collisions
    for (let i = 0; i < dfsRes.path.length - 1; i++) {
      const curr = dfsRes.path[i];
      const next = dfsRes.path[i + 1];
      expect(maze.grid[curr.row][curr.col]).toBe('PASSAGE');
      expect(maze.grid[next.row][next.col]).toBe('PASSAGE');
      const dist = Math.abs(curr.row - next.row) + Math.abs(curr.col - next.col);
      expect(dist).toBe(1); // orthogonal step
    }
  });

  it('handles completely blocked goal correctly', () => {
    // 3x3 grid with blocked goal
    const grid: Grid = [
      ['PASSAGE', 'PASSAGE', 'PASSAGE'],
      ['WALL', 'WALL', 'WALL'],
      ['PASSAGE', 'PASSAGE', 'PASSAGE'],
    ];
    const start: Point = { row: 0, col: 0 };
    const goal: Point = { row: 2, col: 2 };

    const bfsRes = runBFS(grid, start, goal);
    const astarRes = runAStar(grid, start, goal);
    const dfsRes = runDFS(grid, start, goal);
    const dijkstraRes = runDijkstra(grid, start, goal);

    expect(bfsRes.found).toBe(false);
    expect(bfsRes.metrics.status).toBe('No Path');
    expect(bfsRes.metrics.pathLength).toBeNull();

    expect(astarRes.found).toBe(false);
    expect(dfsRes.found).toBe(false);
    expect(dijkstraRes.found).toBe(false);
  });

  it('handles start equals goal correctly', () => {
    const grid: Grid = [['PASSAGE']];
    const pt: Point = { row: 0, col: 0 };

    const bfsRes = runBFS(grid, pt, pt);
    expect(bfsRes.found).toBe(true);
    expect(bfsRes.metrics.pathLength).toBe(1);
    expect(bfsRes.path).toEqual([pt]);
  });
});

