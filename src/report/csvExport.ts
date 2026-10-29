import { BenchmarkTrial } from '../algorithms/types';

export function exportTrialsToCSV(trials: BenchmarkTrial[]): void {
  if (!trials || trials.length === 0) return;

  const headers = [
    'Algorithm',
    'GridSize',
    'Seed',
    'RuntimeMs',
    'ExpandedNodes',
    'DiscoveredNodes',
    'MaxFrontierSize',
    'PathLength',
    'EstimatedMemoryBytes',
    'ShortestPathGuaranteed',
    'Status',
  ];

  const rows = trials.map((t) => [
    t.algorithm,
    t.gridSize,
    t.seed,
    t.runtimeMs,
    t.expandedNodes,
    t.discoveredNodes,
    t.maxFrontierSize,
    t.pathLength !== null ? t.pathLength : 'N/A',
    t.estimatedMemoryBytes,
    t.isOptimal ? 'Yes' : 'No',
    t.status,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `maze_algorithm_benchmark_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

