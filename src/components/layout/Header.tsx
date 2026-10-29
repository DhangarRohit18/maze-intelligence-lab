import React from 'react';
import { Compass, GraduationCap, GitBranch } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-borders sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primaryBlue text-white rounded flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-primaryText tracking-tight">
                Maze Intelligence Lab
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-primaryBlue border border-blue-200 rounded">
                DAA CS3212
              </span>
            </div>
            <p className="text-xs text-secondaryText">
              Interactive Maze Generation, Pathfinding and Algorithm Performance Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-secondaryText">
          <div className="flex items-center gap-1.5 font-medium">
            <GraduationCap className="w-4 h-4 text-secondaryTeal" />
            <span>Vishwakarma Institute of Technology, Pune</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] bg-slate-50 border border-borders px-2 py-1 rounded">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span>v1.0.0-academic</span>
          </div>
        </div>
      </div>
    </header>
  );
};

