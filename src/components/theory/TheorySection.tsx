import React from 'react';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { ALGORITHM_THEORY, MAZE_GEN_THEORY } from '../../theory/complexity';

export const TheorySection: React.FC = () => {
  return (
    <section className="bg-white border border-borders rounded p-4 shadow-xs mt-4">
      <div className="pb-3 mb-4 border-b border-borders">
        <h2 className="text-sm font-semibold text-primaryText flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-primaryBlue" />
          DAA Theoretical Bounds & Complexity Analysis
        </h2>
        <p className="text-xs text-secondaryText">
          Formal asymptotic complexities, graph abstractions, and optimality guarantees under CS3212 Design and Analysis of Algorithms principles.
        </p>
      </div>

      {/* Primary Complexity Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-borders bg-slate-50 text-secondaryText">
              <th className="py-2.5 px-3 font-semibold">Algorithm</th>
              <th className="py-2.5 px-3 font-semibold">Time Complexity (Graph)</th>
              <th className="py-2.5 px-3 font-semibold">Space Complexity (Auxiliary)</th>
              <th className="py-2.5 px-3 font-semibold">Core Data Structure</th>
              <th className="py-2.5 px-3 font-semibold">Shortest Path Guarantee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borders">
            {Object.values(ALGORITHM_THEORY).map((algo) => (
              <tr key={algo.name} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-primaryText">{algo.name}</td>
                <td className="py-2.5 px-3 font-mono font-medium text-primaryBlue">{algo.timeComplexity}</td>
                <td className="py-2.5 px-3 font-mono text-secondaryText">{algo.spaceComplexity}</td>
                <td className="py-2.5 px-3 font-medium text-slate-700">{algo.dataStructures}</td>
                <td className="py-2.5 px-3">
                  {algo.optimality.startsWith('Guaranteed') ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Optimal
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">Non-Optimal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid vs Graph Mapping Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-slate-50 rounded border border-borders">
          <div className="font-semibold text-primaryText mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-secondaryTeal" />
            Maze Representation as an Undirected Graph G = (V, E)
          </div>
          <p className="text-secondaryText leading-relaxed">
            In our orthogonal grid laboratory, each open corridor cell corresponds directly to a graph vertex <span className="font-mono text-primaryText">v ∈ V</span>.
            Orthogonal adjacencies between neighboring open cells define undirected edges <span className="font-mono text-primaryText">e = (u, v) ∈ E</span>.
            Since each cell connects to at most 4 cardinal neighbors (North, South, East, West), the degree bound satisfies <span className="font-mono text-primaryText">deg(v) ≤ 4</span>, ensuring <span className="font-mono text-primaryText">|E| ≤ 4|V|</span>. Consequently, linear graph traversals <span className="font-mono text-primaryText">O(|V| + |E|)</span> reduce to strict <span className="font-mono text-primaryText">O(|V|)</span>.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-borders">
          <div className="font-semibold text-primaryText mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-primaryBlue" />
            Maze Generator: {MAZE_GEN_THEORY.name}
          </div>
          <p className="text-secondaryText leading-relaxed">
            {MAZE_GEN_THEORY.description}
            <br />
            <strong className="text-primaryText font-semibold">Classification: </strong>
            {MAZE_GEN_THEORY.classification} Operates in <span className="font-mono font-medium text-primaryText">{MAZE_GEN_THEORY.timeComplexity}</span> time and <span className="font-mono font-medium text-primaryText">{MAZE_GEN_THEORY.spaceComplexity}</span> auxiliary space.
          </p>
        </div>
      </div>
    </section>
  );
};

