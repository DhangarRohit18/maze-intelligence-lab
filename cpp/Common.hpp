#ifndef COMMON_HPP
#define COMMON_HPP

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <chrono>

enum CellType {
    WALL = 0,
    PASSAGE = 1
};

struct Point {
    int row;
    int col;

    bool operator==(const Point& other) const {
        return row == other.row && col == other.col;
    }

    bool operator!=(const Point& other) const {
        return !(*this == other);
    }
};

struct AlgorithmMetrics {
    std::string algorithmName;
    double executionTimeMs;
    long long expandedNodes;
    long long discoveredNodes;
    long long maxFrontierSize;
    long long pathLength;
    long long estimatedMemoryBytes;
    bool pathFound;
    bool isOptimal;
};

struct SearchResult {
    bool found;
    std::vector<Point> path;
    AlgorithmMetrics metrics;
};

// Direction offsets for 4-way orthogonal grid (Up, Down, Left, Right)
const int D_ROW[4] = {-1, 1, 0, 0};
const int D_COL[4] = {0, 0, -1, 1};

inline int manhattanDistance(const Point& a, const Point& b) {
    return std::abs(a.row - b.row) + std::abs(a.col - b.col);
}

#endif // COMMON_HPP
