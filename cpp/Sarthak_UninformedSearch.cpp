/**
 * ==============================================================================
 * MAZE INTELLIGENCE LAB - CS3212 DAA COURSE PROJECT
 * Institution: Vishwakarma Institute of Technology, Pune
 * MODULE: Uninformed Search Algorithms & Path Reconstruction Engine
 * AUTHOR: Sarthak
 * ==============================================================================
 * DAA Concepts Implemented:
 * 1. Breadth-First Search (BFS):
 *    - Explores the graph layer by layer using an explicit FIFO Queue
 *    - Shortest-Path Guarantee: On unweighted graphs with unit-cost edges, BFS
 *      is proven to find the minimal geodesic distance.
 *    - Time Complexity: O(V + E) = O(V) on 4-connected mazes.
 *    - Space Complexity: O(V) auxiliary queue and visited tracking.
 * 2. Depth-First Search (DFS):
 *    - Traverses down an individual branch until goal or dead end (LIFO Stack)
 *    - Suboptimality Analysis: Demonstrates that DFS makes no shortest-path
 *      guarantees, often yielding meandering, highly circuitous paths.
 *    - Time Complexity: O(V + E)
 *    - Space Complexity: O(V) worst-case recursion/stack depth.
 * 3. Predecessor Backtracking & Path Reconstruction:
 *    - O(L) reconstruction from Goal to Start using parent pointer hash table.
 * ==============================================================================
 */

#ifndef SARTHAK_UNINFORMED_SEARCH_HPP
#define SARTHAK_UNINFORMED_SEARCH_HPP

#include "Common.hpp"
#include "Aditya_MazeGenerator.cpp"
#include <queue>
#include <stack>
#include <algorithm>
#include <chrono>

namespace SarthakModule {

class UninformedSearchEngine {
private:
    static std::vector<Point> reconstructPath(
        const std::vector<std::vector<Point>>& cameFrom,
        Point current,
        Point start
    ) {
        std::vector<Point> path;
        path.push_back(current);

        while (current != start) {
            Point parent = cameFrom[current.row][current.col];
            if (parent.row == -1 && parent.col == -1) break;
            path.push_back(parent);
            current = parent;
        }

        std::reverse(path.begin(), path.end());
        return path;
    }

public:
    // =========================================================================
    // 1. Breadth-First Search (BFS) - Guaranteed Shortest Path
    // =========================================================================
    static SearchResult runBFS(const AdityaModule::MazeInstance& maze) {
        int rows = maze.rows;
        int cols = maze.cols;
        Point start = maze.start;
        Point goal = maze.goal;

        auto startTime = std::chrono::high_resolution_clock::now();

        std::queue<Point> q;
        std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));
        std::vector<std::vector<Point>> cameFrom(rows, std::vector<Point>(cols, {-1, -1}));

        q.push(start);
        visited[start.row][start.col] = true;

        long long expandedNodes = 0;
        long long discoveredNodes = 1;
        long long maxFrontierSize = 1;
        bool found = false;

        while (!q.empty()) {
            maxFrontierSize = std::max(maxFrontierSize, (long long)q.size());
            Point curr = q.front();
            q.pop();
            expandedNodes++;

            if (curr.row == goal.row && curr.col == goal.col) {
                found = true;
                break;
            }

            for (int i = 0; i < 4; ++i) {
                int nr = curr.row + D_ROW[i];
                int nc = curr.col + D_COL[i];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (maze.grid[nr][nc] == PASSAGE && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        cameFrom[nr][nc] = curr;
                        q.push({nr, nc});
                        discoveredNodes++;
                    }
                }
            }
        }

        auto endTime = std::chrono::high_resolution_clock::now();
        double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();

        std::vector<Point> path;
        if (found) {
            path = reconstructPath(cameFrom, goal, start);
        }

        long long memoryBytes = (rows * cols * sizeof(bool)) + 
                               (rows * cols * sizeof(Point)) + 
                               (q.size() * sizeof(Point));

        SearchResult result;
        result.found = found;
        result.path = path;
        result.metrics = {
            "Breadth-First Search (BFS)",
            elapsedMs,
            expandedNodes,
            discoveredNodes,
            maxFrontierSize,
            found ? (long long)path.size() : -1,
            memoryBytes,
            found,
            true // BFS guarantees shortest path on uniform grid
        };

        return result;
    }

    // =========================================================================
    // 2. Depth-First Search (DFS) - Non-Optimal Exploratory Search
    // =========================================================================
    static SearchResult runDFS(const AdityaModule::MazeInstance& maze) {
        int rows = maze.rows;
        int cols = maze.cols;
        Point start = maze.start;
        Point goal = maze.goal;

        auto startTime = std::chrono::high_resolution_clock::now();

        std::stack<Point> s;
        std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));
        std::vector<std::vector<Point>> cameFrom(rows, std::vector<Point>(cols, {-1, -1}));

        s.push(start);
        visited[start.row][start.col] = true;

        long long expandedNodes = 0;
        long long discoveredNodes = 1;
        long long maxFrontierSize = 1;
        bool found = false;

        while (!s.empty()) {
            maxFrontierSize = std::max(maxFrontierSize, (long long)s.size());
            Point curr = s.top();
            s.pop();
            expandedNodes++;

            if (curr.row == goal.row && curr.col == goal.col) {
                found = true;
                break;
            }

            for (int i = 0; i < 4; ++i) {
                int nr = curr.row + D_ROW[i];
                int nc = curr.col + D_COL[i];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (maze.grid[nr][nc] == PASSAGE && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        cameFrom[nr][nc] = curr;
                        s.push({nr, nc});
                        discoveredNodes++;
                    }
                }
            }
        }

        auto endTime = std::chrono::high_resolution_clock::now();
        double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();

        std::vector<Point> path;
        if (found) {
            path = reconstructPath(cameFrom, goal, start);
        }

        long long memoryBytes = (rows * cols * sizeof(bool)) + 
                               (rows * cols * sizeof(Point)) + 
                               (s.size() * sizeof(Point));

        SearchResult result;
        result.found = found;
        result.path = path;
        result.metrics = {
            "Depth-First Search (DFS)",
            elapsedMs,
            expandedNodes,
            discoveredNodes,
            maxFrontierSize,
            found ? (long long)path.size() : -1,
            memoryBytes,
            found,
            false // DFS does NOT guarantee shortest path
        };

        return result;
    }
};

} // namespace SarthakModule

#ifdef STANDALONE_SARTHAK
int main() {
    std::cout << "========================================================\n";
    std::cout << " CS3212 DAA LAB - MODULE 3: SARTHAK (UNINFORMED SEARCH)\n";
    std::cout << "========================================================\n";

    AdityaModule::MazeInstance maze = AdityaModule::MazeGenerator::generate(21, 999);

    std::cout << "\n[1] Executing BFS (Guaranteed Optimal Shortest Path)...";
    SearchResult bfsRes = SarthakModule::UninformedSearchEngine::runBFS(maze);
    std::cout << "\n    - Status: " << (bfsRes.found ? "Path Found" : "No Path");
    std::cout << "\n    - Path Length: " << bfsRes.metrics.pathLength << " steps";
    std::cout << "\n    - Expanded Nodes: " << bfsRes.metrics.expandedNodes;
    std::cout << "\n    - Runtime: " << bfsRes.metrics.executionTimeMs << " ms\n";

    std::cout << "\n[2] Executing DFS (Non-Optimal Exploratory Search)...";
    SearchResult dfsRes = SarthakModule::UninformedSearchEngine::runDFS(maze);
    std::cout << "\n    - Status: " << (dfsRes.found ? "Path Found" : "No Path");
    std::cout << "\n    - Path Length: " << dfsRes.metrics.pathLength << " steps";
    std::cout << "\n    - Expanded Nodes: " << dfsRes.metrics.expandedNodes;
    std::cout << "\n    - Runtime: " << dfsRes.metrics.executionTimeMs << " ms\n";

    std::cout << "\nComparison Note: BFS path (" << bfsRes.metrics.pathLength 
              << ") vs DFS path (" << dfsRes.metrics.pathLength << ").\n";

    return 0;
}
#endif

#endif // SARTHAK_UNINFORMED_SEARCH_HPP
