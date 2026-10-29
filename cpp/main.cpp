/**
 * ==============================================================================
 * MAZE INTELLIGENCE LAB - CS3212 DAA MASTER CONSOLE RUNNER
 * Course: CS3212 - Design and Analysis of Algorithms (DAA)
 * Institution: Vishwakarma Institute of Technology, Pune
 * 
 * Group Members:
 * 1. Rohit   - Informed Search (A* Search & Dijkstra's Algorithm)
 * 2. Aditya  - Graph Modeling & Recursive Backtracking Spanning Tree
 * 3. Sarthak - Uninformed Search (BFS & DFS) & Path Reconstruction
 * 4. Tushar  - Empirical Benchmarking, Statistical Aggregation & CSV Export
 * ==============================================================================
 */

#include "Common.hpp"
#include "Aditya_MazeGenerator.cpp"
#include "Sarthak_UninformedSearch.cpp"
#include "Rohit_InformedSearch.cpp"
#include "Tushar_BenchmarkSuite.cpp"
#include <iostream>
#include <iomanip>

void runSingleMazeDemo() {
    int size = 25;
    uint32_t seed = 42;

    std::cout << "\nGenerating " << size << "x" << size << " Perfect Maze with Seed #" << seed << "...\n";
    AdityaModule::MazeInstance maze = AdityaModule::MazeGenerator::generate(size, seed);

    std::cout << "\nExecuting 4 Algorithms on IDENTICAL Maze Instance:\n";
    SearchResult bfsRes = SarthakModule::UninformedSearchEngine::runBFS(maze);
    SearchResult dfsRes = SarthakModule::UninformedSearchEngine::runDFS(maze);
    SearchResult dijkstraRes = RohitModule::InformedSearchEngine::runDijkstra(maze);
    SearchResult astarRes = RohitModule::InformedSearchEngine::runAStar(maze);

    std::cout << "\n" << std::left 
              << std::setw(30) << "Algorithm" 
              << std::setw(14) << "Path Length" 
              << std::setw(16) << "Expanded Nodes" 
              << std::setw(16) << "Peak Frontier" 
              << std::setw(16) << "Runtime (ms)" 
              << std::setw(12) << "Optimality" 
              << "\n";
    std::cout << std::string(104, '-') << "\n";

    auto printRow = [](const AlgorithmMetrics& m) {
        std::cout << std::left 
                  << std::setw(30) << m.algorithmName
                  << std::setw(14) << m.pathLength
                  << std::setw(16) << m.expandedNodes
                  << std::setw(16) << m.maxFrontierSize
                  << std::setw(16) << std::fixed << std::setprecision(4) << m.executionTimeMs
                  << std::setw(12) << (m.isOptimal ? "Optimal" : "Suboptimal")
                  << "\n";
    };

    printRow(bfsRes.metrics);
    printRow(dfsRes.metrics);
    printRow(dijkstraRes.metrics);
    printRow(astarRes.metrics);

    std::cout << std::string(104, '-') << "\n";
    std::cout << "Optimality Verification: BFS (" << bfsRes.metrics.pathLength 
              << ") == Dijkstra (" << dijkstraRes.metrics.pathLength 
              << ") == A* (" << astarRes.metrics.pathLength << ").\n";

    AdityaModule::MazeGenerator::printMazeASCII(maze, astarRes.path);
}

void runBenchmarkDemo() {
    int size = 25;
    int numTrials = 10;
    std::cout << "\nRunning " << numTrials << " Automated Benchmark Trials on " 
              << size << "x" << size << " Mazes...\n";

    std::vector<uint32_t> seeds;
    for (int i = 0; i < numTrials; ++i) {
        seeds.push_back(1000 + i * 37);
    }

    std::vector<AlgorithmMetrics> records = TusharModule::BenchmarkSuite::runBatchTrial(size, seeds);

    std::vector<std::string> algos = {"BFS", "DFS", "Dijkstra", "A*"};
    std::vector<TusharModule::StatisticalSummary> summaries;
    for (const auto& a : algos) {
        summaries.push_back(TusharModule::BenchmarkSuite::computeStats(a, records));
    }

    TusharModule::BenchmarkSuite::printSummaryTable(summaries);
    TusharModule::BenchmarkSuite::exportCSV("cpp_benchmark_results.csv", records);
}

int main() {
    std::cout << "=========================================================================\n";
    std::cout << " CS3212 DESIGN AND ANALYSIS OF ALGORITHMS - MAZE INTELLIGENCE LAB\n";
    std::cout << " Institution: Vishwakarma Institute of Technology, Pune\n";
    std::cout << " Group Members: Rohit, Aditya, Sarthak, Tushar\n";
    std::cout << "=========================================================================\n";

    int choice = 1;
    std::cout << "\n[1] Run Single Maze Evaluation (Display Matrix & ASCII Path)\n";
    std::cout << "[2] Run Multi-Trial Benchmark Suite (Mean, Median & CSV Export)\n";
    std::cout << "[3] Run Both\n";
    std::cout << "Select mode (default 3): ";
    
    // In automated or interactive runs
    choice = 3;
    std::cout << choice << "\n";

    if (choice == 1 || choice == 3) {
        runSingleMazeDemo();
    }
    if (choice == 2 || choice == 3) {
        runBenchmarkDemo();
    }

    std::cout << "\nExecution successfully completed.\n";
    return 0;
}
