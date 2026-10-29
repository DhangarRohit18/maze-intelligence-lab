# Maze Intelligence Lab
> **Interactive Maze Generation, Pathfinding, and Algorithm Performance Analysis**  
> **Course:** CS3212 – Design and Analysis of Algorithms (DAA)  
> **Institution:** Vishwakarma Institute of Technology, Pune  
> **Group Members:** Rohit, Aditya, Sarthak, Tushar  
> **Live Web Application:** [https://maze-intelligence-lab.vercel.app](https://maze-intelligence-lab.vercel.app)  
> **GitHub Repository:** [https://github.com/DhangarRohit18/maze-intelligence-lab](https://github.com/DhangarRohit18/maze-intelligence-lab)

---

## 1. Project Overview & Problem Statement

**Maze Intelligence Lab** is an academic software project developed for **CS3212 Design and Analysis of Algorithms (DAA)**. It bridges theoretical graph analysis with interactive visual proof and empirical benchmarking.

The application models orthogonal 2D discrete mazes as undirected planar graphs $G = (V, E)$, implements four pathfinding algorithms (**DFS, BFS, Dijkstra, and A***), visualizes their search wave-fronts step by step, and conducts non-blocking statistical benchmarks across multiple randomized maze seeds.

In addition to the interactive React web platform, the core algorithm engine is also implemented in **modular C++ (C++17)** with dedicated standalone modules distributed across all 4 team members.

---

## 2. Team Members & Work Distribution

| Member | Academic Role | Core Algorithm / Topic | Data Structures | Source Files |
| :--- | :--- | :--- | :--- | :--- |
| **Rohit** | Project Lead | **Informed Search ($A^*$) & Dijkstra's Algorithm** | Binary Min-Heap, Hash Map, Euclidean/Manhattan metrics | Web: [`astar.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/astar.ts), [`dijkstra.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/dijkstra.ts), [`priorityQueue.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/priorityQueue.ts)<br>C++: [`Rohit_InformedSearch.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Rohit_InformedSearch.cpp) |
| **Aditya** | Graph Engine Lead | **Graph Modeling & Recursive Backtracking Spanning Tree** | Explicit Stack, 2D Array, Mulberry32 PRNG | Web: [`recursiveBacktracking.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/generator/recursiveBacktracking.ts), [`MazeCanvas.tsx`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/components/maze/MazeCanvas.tsx)<br>C++: [`Aditya_MazeGenerator.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Aditya_MazeGenerator.cpp) |
| **Sarthak** | Traversal Lead | **Uninformed Search (BFS & DFS) & Path Reconstruction** | FIFO Queue, LIFO Stack, Predecessor Map | Web: [`bfs.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/bfs.ts), [`dfs.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/dfs.ts), [`pathReconstruction.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/algorithms/pathReconstruction.ts)<br>C++: [`Sarthak_UninformedSearch.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Sarthak_UninformedSearch.cpp) |
| **Tushar** | Evaluation & QA Lead | **Empirical Benchmarking, Statistics & Report Export** | Web Workers, High-Res Timers, Recharts | Web: [`runner.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/benchmark/runner.ts), [`benchmark.worker.ts`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/benchmark/benchmark.worker.ts), [`AcademicReport.tsx`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/src/components/report/AcademicReport.tsx)<br>C++: [`Tushar_BenchmarkSuite.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Tushar_BenchmarkSuite.cpp) |

---

## 3. Directory Structure

```
c:\Users\user\OneDrive\Desktop\VIT\TY\SEM-5\DAA\CP\
├── cpp/                                     # [C++ STANDALONE ALGORITHM ENGINE]
│   ├── Common.hpp                           # Shared graph primitives (Point, CellType, Metrics)
│   ├── Rohit_InformedSearch.cpp             # [Rohit] A* Search, Dijkstra & Binary Min-Heap
│   ├── Aditya_MazeGenerator.cpp             # [Aditya] Spanning tree maze generator & Mulberry32 PRNG
│   ├── Sarthak_UninformedSearch.cpp         # [Sarthak] BFS (Shortest Path) & DFS (Exploratory)
│   ├── Tushar_BenchmarkSuite.cpp            # [Tushar] High-res timer harness & CSV exporter
│   ├── main.cpp                             # Master unified CLI integrating all 4 members
│   └── README.md                            # C++ compilation & execution instructions
│
├── src/                                     # [WEB APPLICATION ENGINE]
│   ├── algorithms/                          # Core TypeScript pathfinding implementations
│   │   ├── astar.ts                         # A* search with Manhattan heuristic
│   │   ├── dijkstra.ts                      # Dijkstra algorithm with Min-Heap PQ
│   │   ├── bfs.ts                           # Breadth-First Search
│   │   ├── dfs.ts                           # Depth-First Search
│   │   ├── priorityQueue.ts                 # Binary Min-Heap Priority Queue
│   │   ├── pathReconstruction.ts            # Backtracking predecessor chain
│   │   └── types.ts                         # Strict TypeScript interfaces
│   ├── generator/                           # Seeded maze generator
│   │   ├── recursiveBacktracking.ts         # Iterative stack spanning tree generator
│   │   └── seededRandom.ts                  # Mulberry32 32-bit state generator
│   ├── benchmark/                           # Web Worker multithreaded benchmarking
│   │   ├── runner.ts                        # Metric aggregator
│   │   └── benchmark.worker.ts              # Dedicated Web Worker
│   ├── components/                          # Strict light-theme UI components
│   │   ├── maze/MazeCanvas.tsx              # Native HTML5 Canvas renderer
│   │   ├── controls/ControlPanel.tsx        # Grid, seed & animation playback controls
│   │   ├── metrics/MetricsPanel.tsx         # Live telemetry & cost breakdown f(n) = g(n)+h(n)
│   │   ├── comparison/ComparisonTable.tsx   # Concurrent 4-algorithm evaluator
│   │   ├── charts/ExperimentCharts.tsx      # Recharts empirical performance graphs
│   │   ├── benchmark/ExperimentManager.tsx  # Multi-seed batch runner
│   │   ├── theory/TheorySection.tsx         # Complexity bounds & proofs
│   │   └── report/AcademicReport.tsx        # Print-ready evaluation report & CSV download
│   ├── store/mazeStore.ts                   # Zustand centralized reactive state
│   ├── tests/algorithms.test.ts             # Vitest automated unit tests
│   └── App.tsx                              # Main 3-column scientific dashboard
│
├── vercel.json                              # Production edge deployment configuration
├── package.json                             # Dependencies & build scripts
└── README.md                                # Master documentation
```

---

## 4. Theoretical Complexity Summary (DAA Bounds)

| Algorithm | Time Complexity | Space Complexity | Data Structure | Optimality Guarantee |
| :--- | :--- | :--- | :--- | :--- |
| **DFS** | $O(V + E) = O(V)$ | $O(V)$ auxiliary | LIFO Stack | Non-optimal; terminates on first branch found |
| **BFS** | $O(V + E) = O(V)$ | $O(V)$ auxiliary | FIFO Queue | Guaranteed shortest path on uniform unit costs |
| **Dijkstra** | $O((V + E) \log V)$ | $O(V + E)$ auxiliary | Binary Min-Heap | Universally optimal for non-negative weights |
| **A\* Search** | $O(E)$ to $O(b^d)$ | $O(V)$ auxiliary | Binary Min-Heap | Guaranteed optimal under admissible Manhattan heuristic |
| **Recursive Backtracking** | $O(R \times C)$ | $O(R \times C)$ auxiliary | Explicit LIFO Stack | Generates a perfect spanning tree (0 cycles) |

*Note on Graph Bound:* In an orthogonal 4-connected maze, each vertex has maximum degree $\Delta(G) \le 4$. Therefore, $|E| \le 4|V|$, so graph search operations $O(V + E)$ simplify strictly to linear $O(V)$.

---

## 5. How to Run the C++ Algorithm Suite

Each team member has a dedicated standalone file in the [`cpp/`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp) folder that can be compiled and run individually or through the master executable.

### A. Run Individual Member Modules

1. **Rohit ($A^*$ Search & Dijkstra):**
   ```bash
   g++ -O2 -std=c++17 -DSTANDALONE_ROHIT cpp/Rohit_InformedSearch.cpp -o cpp/test_rohit.exe
   ./cpp/test_rohit.exe
   ```

2. **Aditya (Maze Generator & ASCII Viewer):**
   ```bash
   g++ -O2 -std=c++17 -DSTANDALONE_ADITYA cpp/Aditya_MazeGenerator.cpp -o cpp/test_aditya.exe
   ./cpp/test_aditya.exe
   ```

3. **Sarthak (BFS & DFS Traversal Engine):**
   ```bash
   g++ -O2 -std=c++17 -DSTANDALONE_SARTHAK cpp/Sarthak_UninformedSearch.cpp -o cpp/test_sarthak.exe
   ./cpp/test_sarthak.exe
   ```

4. **Tushar (Empirical Benchmark Suite & CSV):**
   ```bash
   g++ -O2 -std=c++17 -DSTANDALONE_TUSHAR cpp/Tushar_BenchmarkSuite.cpp -o cpp/test_tushar.exe
   ./cpp/test_tushar.exe
   ```

### B. Run the Master C++ Laboratory
```bash
g++ -O2 -std=c++17 cpp/main.cpp -o cpp/maze_lab.exe
./cpp/maze_lab.exe
```

---

## 6. How to Run the Web Application

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Automated Unit Tests (Vitest)
```bash
npm test
```
Verifies all 6 correctness suites (reproducible seeds, wall collision prevention, start==goal edge cases, unreachable targets, BFS/Dijkstra/A* shortest path equality).

### Build for Production
```bash
npm run build
```

---

## 7. Live Production Deployment

- **Production URL:** [https://maze-intelligence-lab.vercel.app](https://maze-intelligence-lab.vercel.app)
- **Deployment Platform:** Vercel Global Edge Network
- **Repository:** [https://github.com/DhangarRohit18/maze-intelligence-lab](https://github.com/DhangarRohit18/maze-intelligence-lab)
