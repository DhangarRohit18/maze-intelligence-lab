export interface ComplexityInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  dataStructures: string;
  optimality: string;
  bestCase: string;
  worstCase: string;
  strengths: string;
  weaknesses: string;
  notes: string;
}

export const ALGORITHM_THEORY: Record<string, ComplexityInfo> = {
  DFS: {
    name: 'Depth-First Search (DFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) auxiliary',
    dataStructures: 'LIFO Stack (implicit recursion or explicit stack)',
    optimality: 'No guarantee of shortest path. Returns the first valid path encountered.',
    bestCase: 'O(1) if goal is immediately adjacent on the preferred search branch.',
    worstCase: 'O(V + E) exploring the entire maze tree before reaching goal.',
    strengths: 'Low memory consumption along narrow search corridors; simple stack implementation.',
    weaknesses: 'Frequently wanders deep into blind alleys; path found is often circuitous and suboptimal.',
    notes: 'In grid mazes, E ≤ 4V, so time complexity is strictly linear O(V).',
  },
  BFS: {
    name: 'Breadth-First Search (BFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V) auxiliary',
    dataStructures: 'FIFO Queue',
    optimality: 'Guaranteed shortest path on uniform-cost (unweighted) graphs.',
    bestCase: 'O(1) if goal is immediately adjacent.',
    worstCase: 'O(V + E) exploring concentric rings across the entire maze.',
    strengths: 'Guarantees the minimum step count to target without heuristic computation.',
    weaknesses: 'Maintains a wide frontier, expanding all nodes at depth d before depth d+1.',
    notes: 'Optimal baseline for unit-weight grids; serves as the ground truth for path optimality.',
  },
  DIJKSTRA: {
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E) auxiliary',
    dataStructures: 'Binary Min-Heap Priority Queue, Hash Map',
    optimality: 'Guaranteed optimal path for any non-negative edge weights.',
    bestCase: 'O(1) when target is direct neighbor with minimal weight.',
    worstCase: 'O((V + E) log V) expanding full graph when goal is farthest.',
    strengths: 'Handles non-uniform terrain costs gracefully; universally optimal.',
    weaknesses: 'Uninformed radial expansion; on uniform grids, BFS is faster due to O(1) queue ops vs O(log V) heap ops.',
    notes: 'Equivalent to BFS when all edge weights are identical (w=1), but with binary heap logarithmic overhead.',
  },
  ASTAR: {
    name: 'A* Search Algorithm',
    timeComplexity: 'O(E) to O(b^d)',
    spaceComplexity: 'O(V) auxiliary',
    dataStructures: 'Binary Min-Heap Priority Queue, Hash Maps for gScore & fScore',
    optimality: 'Guaranteed optimal when heuristic h(n) is admissible (never overestimates) and consistent.',
    bestCase: 'O(d) linear along ideal ray when heuristic directly guides expansion to goal.',
    worstCase: 'O((V + E) log V) degenerates to Dijkstra if heuristic provides 0 guidance.',
    strengths: 'Dramatic reduction in expanded nodes via goal-directed heuristic (Manhattan distance on 4-way grid).',
    weaknesses: 'Retains all explored and frontier nodes in memory (cannot prune open set without risk).',
    notes: 'Evaluation function f(n) = g(n) + h(n). Manhattan metric satisfies triangle inequality (monotone consistency).',
  },
};

export const MAZE_GEN_THEORY = {
  name: 'Randomized Recursive Backtracking',
  timeComplexity: 'O(R × C)',
  spaceComplexity: 'O(R × C) auxiliary stack',
  classification: 'Depth-First Search spanning tree generator (not divide-and-conquer).',
  description:
    'A randomized variation of depth-first search. Starting from a single cell, the algorithm iteratively visits unvisited neighbors 2 cells away, carving passages through the intermediary wall. When all neighbors are visited, it backtracks. This creates a "perfect maze" (a spanning tree with exactly one simple path between any two cells, zero loops, and no isolated regions).',
};

