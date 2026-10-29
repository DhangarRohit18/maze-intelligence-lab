/**
 * ==============================================================================
 * MAZE INTELLIGENCE LAB - CS3212 DAA COURSE PROJECT
 * Institution: Vishwakarma Institute of Technology, Pune
 * MODULE: Informed Search Algorithms & Priority-Queue Optimization
 * AUTHOR: Rohit
 * ==============================================================================
 * DAA Concepts Implemented:
 * 1. A* Search Algorithm:
 *    - Evaluation function: f(n) = g(n) + h(n)
 *      - g(n): Actual accumulated path cost from start to node n.
 *      - h(n): Estimated cost to goal via Manhattan Distance: |dr| + |dc|.
 *    - Heuristic Admissibility & Consistency:
 *      - Since Manhattan distance never overestimates true grid steps, A* is
 *        guaranteed to return an optimal shortest path while pruning the open set.
 *    - Time Complexity: O(E) best-case up to O(b^d) worst-case.
 * 2. Dijkstra's Algorithm:
 *    - Greedy uniform-cost search relaxing edge distances: dist[v] = dist[u] + w(u,v)
 *    - Implemented via a Binary Min-Heap Priority Queue.
 *    - Time Complexity: O((V + E) log V).
 * 3. Priority Queue Heap Engine:
 *    - Min-Heap ordering guaranteeing minimum f(n) / dist(n) extraction in O(log N).
 * ==============================================================================
 */

#ifndef ROHIT_INFORMED_SEARCH_HPP
#define ROHIT_INFORMED_SEARCH_HPP

#include "Common.hpp"
#include "Aditya_MazeGenerator.cpp"
#include <queue>
#include <vector>
#include <cmath>
#include <algorithm>
#include <chrono>

namespace RohitModule {

// Heap Element for Dijkstra & A*
struct HeapNode {
    Point pt;
    double priority; // dist for Dijkstra, f(n) for A*

    bool operator>(const HeapNode& other) const {
        return priority > other.priority; // Min-Heap
    }
};

class InformedSearchEngine {
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
    // 1. Dijkstra's Algorithm (Min-Heap Priority Queue)
    // =========================================================================
    static SearchResult runDijkstra(const AdityaModule::MazeInstance& maze) {
        int rows = maze.rows;
        int cols = maze.cols;
        Point start = maze.start;
        Point goal = maze.goal;

        auto startTime = std::chrono::high_resolution_clock::now();

        std::priority_queue<HeapNode, std::vector<HeapNode>, std::greater<HeapNode>> pq;
        std::vector<std::vector<int>> dist(rows, std::vector<int>(cols, 1e9));
        std::vector<std::vector<bool>> finalized(rows, std::vector<bool>(cols, false));
        std::vector<std::vector<Point>> cameFrom(rows, std::vector<Point>(cols, {-1, -1}));

        dist[start.row][start.col] = 0;
        pq.push({start, 0.0});

        long long expandedNodes = 0;
        long long discoveredNodes = 1;
        long long maxFrontierSize = 1;
        bool found = false;

        while (!pq.empty()) {
            maxFrontierSize = std::max(maxFrontierSize, (long long)pq.size());
            HeapNode top = pq.top();
            pq.pop();
            Point curr = top.pt;

            if (finalized[curr.row][curr.col]) continue;
            finalized[curr.row][curr.col] = true;
            expandedNodes++;

            if (curr.row == goal.row && curr.col == goal.col) {
                found = true;
                break;
            }

            int currentDist = dist[curr.row][curr.col];

            for (int i = 0; i < 4; ++i) {
                int nr = curr.row + D_ROW[i];
                int nc = curr.col + D_COL[i];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (maze.grid[nr][nc] == PASSAGE && !finalized[nr][nc]) {
                        int tentativeDist = currentDist + 1; // Unit weight = 1
                        if (tentativeDist < dist[nr][nc]) {
                            if (dist[nr][nc] == 1e9) {
                                discoveredNodes++;
                            }
                            dist[nr][nc] = tentativeDist;
                            cameFrom[nr][nc] = curr;
                            pq.push({{nr, nc}, (double)tentativeDist});
                        }
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

        long long memoryBytes = (rows * cols * sizeof(int)) + 
                               (rows * cols * sizeof(bool)) + 
                               (rows * cols * sizeof(Point)) + 
                               (pq.size() * sizeof(HeapNode));

        SearchResult result;
        result.found = found;
        result.path = path;
        result.metrics = {
            "Dijkstra's Algorithm",
            elapsedMs,
            expandedNodes,
            discoveredNodes,
            maxFrontierSize,
            found ? (long long)path.size() : -1,
            memoryBytes,
            found,
            true // Guaranteed optimal
        };

        return result;
    }

    // =========================================================================
    // 2. A* Search Algorithm (Admissible Manhattan Heuristic)
    // =========================================================================
    static SearchResult runAStar(const AdityaModule::MazeInstance& maze) {
        int rows = maze.rows;
        int cols = maze.cols;
        Point start = maze.start;
        Point goal = maze.goal;

        auto startTime = std::chrono::high_resolution_clock::now();

        std::priority_queue<HeapNode, std::vector<HeapNode>, std::greater<HeapNode>> pq;
        std::vector<std::vector<int>> gScore(rows, std::vector<int>(cols, 1e9));
        std::vector<std::vector<bool>> finalized(rows, std::vector<bool>(cols, false));
        std::vector<std::vector<Point>> cameFrom(rows, std::vector<Point>(cols, {-1, -1}));

        gScore[start.row][start.col] = 0;
        double startF = 0 + manhattanDistance(start, goal);
        pq.push({start, startF});

        long long expandedNodes = 0;
        long long discoveredNodes = 1;
        long long maxFrontierSize = 1;
        bool found = false;

        while (!pq.empty()) {
            maxFrontierSize = std::max(maxFrontierSize, (long long)pq.size());
            HeapNode top = pq.top();
            pq.pop();
            Point curr = top.pt;

            if (finalized[curr.row][curr.col]) continue;
            finalized[curr.row][curr.col] = true;
            expandedNodes++;

            if (curr.row == goal.row && curr.col == goal.col) {
                found = true;
                break;
            }

            int currG = gScore[curr.row][curr.col];

            for (int i = 0; i < 4; ++i) {
                int nr = curr.row + D_ROW[i];
                int nc = curr.col + D_COL[i];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (maze.grid[nr][nc] == PASSAGE && !finalized[nr][nc]) {
                        int tentativeG = currG + 1;
                        if (tentativeG < gScore[nr][nc]) {
                            if (gScore[nr][nc] == 1e9) {
                                discoveredNodes++;
                            }
                            gScore[nr][nc] = tentativeG;
                            cameFrom[nr][nc] = curr;
                            double f = tentativeG + manhattanDistance({nr, nc}, goal);
                            pq.push({{nr, nc}, f});
                        }
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

        long long memoryBytes = (rows * cols * sizeof(int)) + 
                               (rows * cols * sizeof(bool)) + 
                               (rows * cols * sizeof(Point)) + 
                               (pq.size() * sizeof(HeapNode));

        SearchResult result;
        result.found = found;
        result.path = path;
        result.metrics = {
            "A* Search (Manhattan Heuristic)",
            elapsedMs,
            expandedNodes,
            discoveredNodes,
            maxFrontierSize,
            found ? (long long)path.size() : -1,
            memoryBytes,
            found,
            true // Guaranteed optimal under admissible heuristic
        };

        return result;
    }
};

} // namespace RohitModule

#ifdef STANDALONE_ROHIT
int main() {
    std::cout << "========================================================\n";
    std::cout << " CS3212 DAA LAB - MODULE 1: ROHIT (INFORMED SEARCH)\n";
    std::cout << "========================================================\n";

    AdityaModule::MazeInstance maze = AdityaModule::MazeGenerator::generate(21, 555);

    std::cout << "\n[1] Executing Dijkstra's Algorithm (Min-Heap)...";
    SearchResult dijkstraRes = RohitModule::InformedSearchEngine::runDijkstra(maze);
    std::cout << "\n    - Path Length: " << dijkstraRes.metrics.pathLength;
    std::cout << "\n    - Expanded Nodes: " << dijkstraRes.metrics.expandedNodes;
    std::cout << "\n    - Execution Time: " << dijkstraRes.metrics.executionTimeMs << " ms\n";

    std::cout << "\n[2] Executing A* Search Algorithm (f = g + h)...";
    SearchResult astarRes = RohitModule::InformedSearchEngine::runAStar(maze);
    std::cout << "\n    - Path Length: " << astarRes.metrics.pathLength;
    std::cout << "\n    - Expanded Nodes: " << astarRes.metrics.expandedNodes;
    std::cout << "\n    - Execution Time: " << astarRes.metrics.executionTimeMs << " ms\n";

    std::cout << "\nKey Observation: Both find identical shortest path (" 
              << dijkstraRes.metrics.pathLength << " steps), but A* pruned expansion down to "
              << astarRes.metrics.expandedNodes << " nodes vs " << dijkstraRes.metrics.expandedNodes << " in Dijkstra.\n";

    return 0;
}
#endif

#endif // ROHIT_INFORMED_SEARCH_HPP
