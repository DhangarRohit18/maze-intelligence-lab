# Maze Intelligence Lab
**Interactive Maze Generation, Pathfinding, and Algorithm Performance Analysis**  
*Course:* CS3212 – Design and Analysis of Algorithms (DAA)  
*Institution:* Vishwakarma Institute of Technology, Pune

---

## 1. Overview
Maze Intelligence Lab is an educational, scientific web application designed to evaluate, visualize, and benchmark graph search algorithms on 2D orthogonal mazes. It features an independent algorithm engine, step-by-step canvas visualization, real-time telemetry, concurrent algorithm comparison on identical mazes, statistical multi-seed benchmarking via Web Workers, DAA complexity proofs, and CSV export.

---

## 2. Features Implemented

### Pathfinding Algorithms
- **Depth-First Search (DFS):** Stack-based exploration with visited tracking, parent pointers, and path reconstruction. Explains suboptimality.
- **Breadth-First Search (BFS):** FIFO queue-based traversal guaranteeing shortest paths on unweighted uniform-cost corridors.
- **Dijkstra's Algorithm:** Uniform-cost search using an explicit **Binary Min-Heap Priority Queue** (no repeated array sorting).
- **A* Search Algorithm:** Informed search evaluating $f(n) = g(n) + h(n)$ using admissible and consistent Manhattan distance heuristic $h(n) = |x_1 - x_2| + |y_1 - y_2|$.

### Maze Generation
- **Randomized Recursive Backtracking:** Stack-based depth-first spanning tree generator that guarantees a perfect maze (connected, zero topological cycles, exactly one simple path between any two passage cells).
- Reproducible seeded pseudo-random number generator (`Mulberry32`).

### Visualization & Control
- High-performance HTML Canvas rendering with responsive scaling.
- Step-by-step playback controls (Play, Pause, Resume, Step Forward, Reset).
- Real-time speed adjustment slider ($2\text{ms}$ to $150\text{ms}$).
- Overlays for Explored (Closed Set), Frontier (Open Set), and Reconstructed Shortest Path.
- Interactive repositioning: Click to move Start ($\mathbf{S}$), Shift-click to move Goal ($\mathbf{G}$).

### Telemetry & Benchmarking
- High-resolution timing via `performance.now()` measuring pure algorithmic search isolated from DOM rendering.
- Exact telemetry: Expanded Nodes, Discovered Nodes, Peak Frontier Size, Path Length, and algorithmic estimated memory.
- Multithreaded Web Worker benchmark runner with statistical aggregation (Mean, Median, Spread) across multi-seed trial suites.
- CSV dataset export for external verification.
- Print-ready DAA academic laboratory report.

---

## 3. Strict Light Theme Design
- Main Background: `#FFFFFF`
- Secondary Background: `#F1F5F9`
- Primary Blue: `#2563EB`
- Secondary Teal: `#0D9488`
- Primary Text: `#1E293B`
- Secondary Text: `#64748B`
- Borders: `#D9E1EA`
- Wall Cells: `#334155`
- Unvisited Cells: `#FFFFFF`
- Explored Cells: `#BFDBFE`
- Frontier Cells: `#A5F3FC`
- Final Path: `#FBBF24`
- Start Node: `#16A34A`
- Goal Node: `#DC2626`

---

## 4. Getting Started & Commands

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### Run Automated Correctness Unit Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory.

