/**
 * ==============================================================================
 * MAZE INTELLIGENCE LAB - CS3212 DAA COURSE PROJECT
 * Institution: Vishwakarma Institute of Technology, Pune
 * MODULE: Graph Modeling, Spanning Trees & Randomized Maze Generation
 * AUTHOR: Aditya
 * ==============================================================================
 * DAA Concepts Implemented:
 * 1. Graph Abstraction: 2D orthogonal grid to undirected graph G = (V, E)
 *    - Open corridors are vertices |V| <= R * C
 *    - Degree bound: Delta(G) <= 4, hence |E| <= 4|V|
 * 2. Randomized Recursive Backtracking (Depth-First Spanning Tree):
 *    - Generates a "perfect maze" with zero cycles and exactly one simple path
 *    - Iterative stack implementation to eliminate call-stack overflow on large grids
 *    - Time Complexity: O(R * C)
 *    - Space Complexity: O(R * C) auxiliary stack
 * 3. Seeded Mulberry32 Pseudo-Random Number Generator:
 *    - Deterministic 32-bit state hashing for reproducible experiment trials
 * ==============================================================================
 */

#ifndef ADITYA_MAZE_GENERATOR_HPP
#define ADITYA_MAZE_GENERATOR_HPP

#include "Common.hpp"
#include <vector>
#include <stack>
#include <cstdint>
#include <iomanip>

namespace AdityaModule {

class SeededRandom {
private:
    uint32_t state;

public:
    SeededRandom(uint32_t seed = 42) {
        state = seed ? seed : 1;
    }

    // Mulberry32 generator
    uint32_t next() {
        uint32_t z = (state += 0x6D2B79F5UL);
        z = (z ^ (z >> 15)) * (z | 1UL);
        z ^= z + (z ^ (z >> 7)) * (z | 61UL);
        return z ^ (z >> 14);
    }

    int nextInt(int minVal, int maxVal) {
        if (minVal >= maxVal) return minVal;
        return minVal + (int)(next() % (maxVal - minVal + 1));
    }

    template <typename T>
    void shuffle(std::vector<T>& vec) {
        for (int i = (int)vec.size() - 1; i > 0; --i) {
            int j = nextInt(0, i);
            std::swap(vec[i], vec[j]);
        }
    }
};

struct MazeInstance {
    int rows;
    int cols;
    uint32_t seed;
    Point start;
    Point goal;
    std::vector<std::vector<CellType>> grid;
};

class MazeGenerator {
public:
    static MazeInstance generate(int dimension, uint32_t seed = 42) {
        // Dimensions must be odd for corridor/wall alternating lattice
        int size = (dimension % 2 == 0) ? dimension + 1 : dimension;
        int rows = size;
        int cols = size;

        MazeInstance maze;
        maze.rows = rows;
        maze.cols = cols;
        maze.seed = seed;
        maze.start = {1, 1};
        maze.goal = {rows - 2, cols - 2};
        maze.grid.assign(rows, std::vector<CellType>(cols, WALL));

        SeededRandom rng(seed);

        // Mark start cell as passage
        maze.grid[maze.start.row][maze.start.col] = PASSAGE;

        std::stack<Point> stack;
        stack.push(maze.start);

        std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));
        visited[maze.start.row][maze.start.col] = true;

        struct MoveDir {
            int dr, dc, wallR, wallC;
        };

        const MoveDir roomDirs[4] = {
            {-2, 0, -1, 0}, // North
            {2, 0, 1, 0},   // South
            {0, -2, 0, -1}, // West
            {0, 2, 0, 1}    // East
        };

        // Iterative Stack Backtracking
        while (!stack.empty()) {
            Point curr = stack.top();

            std::vector<MoveDir> validMoves;
            for (int i = 0; i < 4; ++i) {
                int nr = curr.row + roomDirs[i].dr;
                int nc = curr.col + roomDirs[i].dc;

                if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1) {
                    if (!visited[nr][nc]) {
                        validMoves.push_back(roomDirs[i]);
                    }
                }
            }

            if (!validMoves.empty()) {
                int chosenIdx = rng.nextInt(0, (int)validMoves.size() - 1);
                MoveDir m = validMoves[chosenIdx];

                // Carve wall and adjacent room
                maze.grid[curr.row + m.wallR][curr.col + m.wallC] = PASSAGE;
                maze.grid[curr.row + m.dr][curr.col + m.dc] = PASSAGE;

                visited[curr.row + m.dr][curr.col + m.dc] = true;
                stack.push({curr.row + m.dr, curr.col + m.dc});
            } else {
                stack.pop();
            }
        }

        // Ensure goal is always open
        maze.grid[maze.goal.row][maze.goal.col] = PASSAGE;
        return maze;
    }

    static void printMazeASCII(const MazeInstance& maze, const std::vector<Point>& path = {}) {
        std::vector<std::vector<char>> display(maze.rows, std::vector<char>(maze.cols, ' '));

        for (int r = 0; r < maze.rows; ++r) {
            for (int c = 0; c < maze.cols; ++c) {
                if (maze.grid[r][c] == WALL) {
                    display[r][c] = '#';
                } else {
                    display[r][c] = ' ';
                }
            }
        }

        // Mark path if provided
        for (const auto& p : path) {
            display[p.row][p.col] = '.';
        }

        display[maze.start.row][maze.start.col] = 'S';
        display[maze.goal.row][maze.goal.col] = 'G';

        std::cout << "\n--- MAZE ASCII VIEW (" << maze.rows << "x" << maze.cols 
                  << ", Seed: " << maze.seed << ") ---\n";
        for (int r = 0; r < maze.rows; ++r) {
            for (int c = 0; c < maze.cols; ++c) {
                std::cout << display[r][c];
            }
            std::cout << "\n";
        }
        std::cout << "Legend: '#' = Wall, ' ' = Corridor, 'S' = Start, 'G' = Goal, '.' = Path\n\n";
    }
};

} // namespace AdityaModule

#ifdef STANDALONE_ADITYA
int main() {
    std::cout << "========================================================\n";
    std::cout << " CS3212 DAA LAB - MODULE 2: ADITYA (MAZE GENERATOR)\n";
    std::cout << "========================================================\n";

    AdityaModule::MazeInstance maze = AdityaModule::MazeGenerator::generate(21, 12345);
    std::cout << "Generated " << maze.rows << "x" << maze.cols << " Perfect Maze.\n";
    std::cout << "Start Node: (" << maze.start.row << ", " << maze.start.col << ")\n";
    std::cout << "Goal Node:  (" << maze.goal.row << ", " << maze.goal.col << ")\n";

    AdityaModule::MazeGenerator::printMazeASCII(maze);
    return 0;
}
#endif

#endif // ADITYA_MAZE_GENERATOR_HPP
