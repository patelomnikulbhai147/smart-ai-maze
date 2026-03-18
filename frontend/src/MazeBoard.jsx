import React from 'react';
import { motion } from 'framer-motion';

const MazeBoard = ({ grid, playerPos, startPos, endPos, hintPath }) => {
  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div 
      className="bg-maze-bg p-2 rounded-xl shadow-2xl border border-slate-800"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: '2px',
        width: 'min(80vw, 80vh)',
        height: 'min(80vw, 80vh)',
      }}
    >
      {grid.map((row, y) => (
        row.map((cell, x) => {
          const isWall = cell === 1;
          const isPlayer = playerPos[0] === y && playerPos[1] === x;
          const isStart = startPos[0] === y && startPos[1] === x;
          const isEnd = endPos[0] === y && endPos[1] === x;
          const isHint = hintPath && hintPath.some(p => p[0] === y && p[1] === x);
          
          let bgColor = isWall ? 'bg-maze-wall' : 'bg-maze-path';
          let customClass = '';
          
          if (isPlayer) {
            bgColor = 'bg-maze-player';
            customClass = 'glow-player z-10 rounded-sm';
          } else if (isStart) {
            bgColor = 'bg-maze-start';
            customClass = 'glow-start rounded-sm opacity-50';
          } else if (isEnd) {
            bgColor = 'bg-maze-end';
            customClass = 'glow-end rounded-sm';
          } else if (isHint) {
            bgColor = 'bg-maze-hint';
            customClass = 'glow-hint rounded-full w-1/2 h-1/2 m-auto opacity-70';
          }

          return (
            <motion.div
              key={`${y}-${x}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: (x + y) * 0.005 }}
              className={`w-full h-full flex items-center justify-center ${
                !isWall && !isPlayer && !isStart && !isEnd && !isHint ? 'bg-maze-path' : ''
              }`}
            >
              <div className={`w-full h-full ${bgColor} ${customClass}`} />
            </motion.div>
          );
        })
      ))}
    </div>
  );
};

export default MazeBoard;
