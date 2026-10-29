import React from 'react';
import { Header } from './components/layout/Header';
import { ControlPanel } from './components/controls/ControlPanel';
import { MazeCanvas } from './components/maze/MazeCanvas';
import { MetricsPanel } from './components/metrics/MetricsPanel';
import { ComparisonTable } from './components/comparison/ComparisonTable';
import { ExperimentCharts } from './components/charts/ExperimentCharts';
import { ExperimentManager } from './components/benchmark/ExperimentManager';
import { TheorySection } from './components/theory/TheorySection';
import { AcademicReport } from './components/report/AcademicReport';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-primaryText">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Main 3-Column Dashboard Section (Desktop 1440x900 optimized) */}
        <div className="flex flex-col lg:flex-row items-start gap-4">
          {/* Left Column: Maze & Algorithm Controls */}
          <ControlPanel />

          {/* Center Column: Interactive Canvas */}
          <MazeCanvas />

          {/* Right Column: Live Telemetry */}
          <MetricsPanel />
        </div>

        {/* Algorithm Comparative Laboratory */}
        <ComparisonTable />

        {/* Performance Visualization & Real Metric Charts */}
        <ExperimentCharts />

        {/* Multi-Trial Benchmark Experiment Runner */}
        <ExperimentManager />

        {/* Formal Theory, Big-O Complexity Bounds & Optimality Proofs */}
        <TheorySection />

        {/* Full DAA Academic Laboratory Report & Export */}
        <AcademicReport />
      </main>

      <footer className="w-full bg-white border-t border-borders py-4 text-center text-xs text-secondaryText">
        CS3212 Design and Analysis of Algorithms | Maze Intelligence Lab | Strict Light-Theme Scientific Workspace
      </footer>
    </div>
  );
};

export default App;

