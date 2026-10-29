import React, { useRef, useEffect } from 'react';
import { useMazeStore } from '../../store/mazeStore';
import { Point } from '../../algorithms/types';

export const MazeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    grid,
    start,
    goal,
    currentSnapshot,
    showExplored,
    showFrontier,
    showPath,
    setCustomStart,
    setCustomGoal,
    playbackStatus,
  } = useMazeStore();

  const rows = grid.length;
  const cols = grid[0].length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / cols;
    const cellH = height / rows;

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Grid Walls & Passages
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 'WALL') {
          ctx.fillStyle = '#334155'; // Wall cell
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        } else {
          ctx.fillStyle = '#FFFFFF'; // Unvisited cell
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }

    // 2. Explored / Closed Set
    if (showExplored && currentSnapshot && currentSnapshot.explored.length > 0) {
      ctx.fillStyle = '#BFDBFE'; // Explored light blue
      for (const p of currentSnapshot.explored) {
        // Do not overwrite start or goal visuals
        if ((p.row === start.row && p.col === start.col) || (p.row === goal.row && p.col === goal.col)) {
          continue;
        }
        ctx.fillRect(p.col * cellW, p.row * cellH, cellW, cellH);
      }
    }

    // 3. Frontier / Open Set
    if (showFrontier && currentSnapshot && currentSnapshot.frontier.length > 0) {
      ctx.fillStyle = '#A5F3FC'; // Cyan frontier
      for (const p of currentSnapshot.frontier) {
        if ((p.row === start.row && p.col === start.col) || (p.row === goal.row && p.col === goal.col)) {
          continue;
        }
        ctx.fillRect(p.col * cellW, p.row * cellH, cellW, cellH);
      }
    }

    // 4. Reconstructed Path
    if (showPath && currentSnapshot && currentSnapshot.path && currentSnapshot.path.length > 0) {
      ctx.fillStyle = '#FBBF24'; // Final path yellow
      for (const p of currentSnapshot.path) {
        if ((p.row === start.row && p.col === start.col) || (p.row === goal.row && p.col === goal.col)) {
          continue;
        }
        ctx.fillRect(p.col * cellW, p.row * cellH, cellW, cellH);
      }
    }

    // 5. Subtle Grid Line Borders
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(width, r * cellH);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, height);
      ctx.stroke();
    }

    // 6. Draw Start Node (Green 'S')
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(start.col * cellW, start.row * cellH, cellW, cellH);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(10, Math.floor(cellH * 0.7))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', (start.col + 0.5) * cellW, (start.row + 0.5) * cellH);

    // 7. Draw Goal Node (Red 'G')
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(goal.col * cellW, goal.row * cellH, cellW, cellH);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(10, Math.floor(cellH * 0.7))}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('G', (goal.col + 0.5) * cellW, (goal.row + 0.5) * cellH);

    // 8. Draw Active Node Marker if in progress
    if (currentSnapshot && currentSnapshot.current && currentSnapshot.status === 'Running') {
      const cur = currentSnapshot.current;
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc((cur.col + 0.5) * cellW, (cur.row + 0.5) * cellH, Math.min(cellW, cellH) * 0.35, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [grid, start, goal, currentSnapshot, showExplored, showFrontier, showPath, rows, cols]);

  // Click on maze to reposition Start or Goal if idle
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (playbackStatus === 'RUNNING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);

    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (grid[row][col] === 'WALL') return; // Cannot place inside walls

    const clickedPoint: Point = { row, col };

    if (e.shiftKey) {
      // Shift-click moves Goal
      setCustomGoal(clickedPoint);
    } else {
      // Normal click moves Start
      setCustomStart(clickedPoint);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-white border border-borders rounded p-4 shadow-xs">
      {/* Legend Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-borders text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#16A34A] flex items-center justify-center text-white font-bold text-[9px]">S</span>
            <span className="text-secondaryText font-medium">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#DC2626] flex items-center justify-center text-white font-bold text-[9px]">G</span>
            <span className="text-secondaryText font-medium">Goal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#334155]"></span>
            <span className="text-secondaryText font-medium">Wall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#FFFFFF] border border-borders"></span>
            <span className="text-secondaryText font-medium">Passage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#BFDBFE]"></span>
            <span className="text-secondaryText font-medium">Explored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#A5F3FC]"></span>
            <span className="text-secondaryText font-medium">Frontier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#FBBF24]"></span>
            <span className="text-secondaryText font-medium">Path</span>
          </div>
        </div>

        <span className="text-[11px] text-secondaryText italic hidden sm:inline">
          Tip: Click corridor to set Start, Shift+Click to set Goal
        </span>
      </div>

      {/* Responsive Canvas Container */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[420px] max-h-[580px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          onClick={handleCanvasClick}
          className="border border-borders shadow-xs rounded cursor-pointer max-w-full max-h-[560px] aspect-square object-contain bg-white"
        />
      </div>
    </div>
  );
};

