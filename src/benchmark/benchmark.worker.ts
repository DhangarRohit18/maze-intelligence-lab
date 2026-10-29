import { AlgorithmType } from '../algorithms/types';
import { runBenchmarkSuite } from './runner';

self.onmessage = (e: MessageEvent) => {
  const { algorithms, gridSize, seeds } = e.data as {
    algorithms: AlgorithmType[];
    gridSize: number;
    seeds: number[];
  };

  try {
    const result = runBenchmarkSuite(algorithms, gridSize, seeds, (completed, total) => {
      self.postMessage({ type: 'PROGRESS', completed, total });
    });

    self.postMessage({ type: 'COMPLETE', data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: 'ERROR', error: msg });
  }
};

