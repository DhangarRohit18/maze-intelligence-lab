# CS3212 DAA Course Project: C++ Algorithm Engine

**Institution:** Vishwakarma Institute of Technology, Pune  
**Course:** CS3212 – Design and Analysis of Algorithms (DAA)  
**Authors:** Rohit, Aditya, Sarthak, Tushar  

---

## Folder Location
**Absolute Path:** `c:\Users\user\OneDrive\Desktop\VIT\TY\SEM-5\DAA\CP\cpp`

---

## Distributed Module Ownership

| File | Author | Topics & DAA Concept |
| :--- | :--- | :--- |
| [`Rohit_InformedSearch.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Rohit_InformedSearch.cpp) | **Rohit** | $A^*$ Search, Dijkstra's Algorithm, Binary Min-Heap, Manhattan Heuristic Admissibility |
| [`Aditya_MazeGenerator.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Aditya_MazeGenerator.cpp) | **Aditya** | Randomized Recursive Backtracking, Spanning Trees, Mulberry32 PRNG, ASCII Renderer |
| [`Sarthak_UninformedSearch.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Sarthak_UninformedSearch.cpp) | **Sarthak** | Breadth-First Search (BFS), Depth-First Search (DFS), Path Reconstruction from Parent Pointers |
| [`Tushar_BenchmarkSuite.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/Tushar_BenchmarkSuite.cpp) | **Tushar** | `std::chrono` High-Resolution Benchmarking, Statistical Aggregator (Mean, Median, StdDev), CSV Export |
| [`main.cpp`](file:///c:/Users/user/OneDrive/Desktop/VIT/TY/SEM-5/DAA/CP/cpp/main.cpp) | **All** | Master Console Laboratory integrating all 4 modules |

---

## Standalone Compilation Commands (Terminal / Command Prompt)

### 1. Compile & Run Rohit's Module
```bash
g++ -O2 -std=c++17 -DSTANDALONE_ROHIT Rohit_InformedSearch.cpp -o test_rohit.exe
./test_rohit.exe
```

### 2. Compile & Run Aditya's Module
```bash
g++ -O2 -std=c++17 -DSTANDALONE_ADITYA Aditya_MazeGenerator.cpp -o test_aditya.exe
./test_aditya.exe
```

### 3. Compile & Run Sarthak's Module
```bash
g++ -O2 -std=c++17 -DSTANDALONE_SARTHAK Sarthak_UninformedSearch.cpp -o test_sarthak.exe
./test_sarthak.exe
```

### 4. Compile & Run Tushar's Module
```bash
g++ -O2 -std=c++17 -DSTANDALONE_TUSHAR Tushar_BenchmarkSuite.cpp -o test_tushar.exe
./test_tushar.exe
```

### 5. Compile & Run Master Program
```bash
g++ -O2 -std=c++17 main.cpp -o maze_lab.exe
./maze_lab.exe
```
