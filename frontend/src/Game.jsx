import React, { useState, useEffect, useCallback } from 'react';
import { generateMaze, getHint } from './api';
import MazeBoard from './MazeBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, RotateCcw, Play, Trophy } from 'lucide-react';

const LEVELS = [
  { level: 1, size: 8 },
  { level: 2, size: 10 },
  { level: 3, size: 12 },
  { level: 4, size: 15 },
  { level: 5, size: 20 }
];

const Game = () => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [gameStatus, setGameStatus] = useState('menu'); // menu, playing, win, complete
  
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const [startPos, setStartPos] = useState([1, 1]);
  const [endPos, setEndPos] = useState([1, 1]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [hintPath, setHintPath] = useState([]);
  
  const currentLevel = LEVELS[levelIdx];

  const loadLevel = async (idx) => {
    const lvl = LEVELS[idx];
    try {
      console.log(`Starting to load level ${idx}...`);
      const data = await generateMaze(lvl.size, lvl.size);
      console.log("Maze data received:", data);
      setGrid(data.grid);
      setStartPos(data.start);
      setEndPos(data.end);
      setPlayerPos(data.start);
      setTimeElapsed(0);
      setMoves(0);
      setHintPath([]);
      setGameStatus('playing');
    } catch (err) {
      console.error("Failed to load maze:", err);
      alert("Failed to connect to backend: " + err.message);
    }
  };

  const startGame = () => {
    setLevelIdx(0);
    setScore(0);
    loadLevel(0);
  };

  const nextLevel = () => {
    if (levelIdx + 1 < LEVELS.length) {
      setLevelIdx(levelIdx + 1);
      loadLevel(levelIdx + 1);
    } else {
      setGameStatus('complete');
    }
  };

  const restartLevel = () => {
    loadLevel(levelIdx);
  };

  // Timer
  useEffect(() => {
    let timer;
    if (gameStatus === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  // Movement handler
  const handleKeyDown = useCallback((e) => {
    if (gameStatus !== 'playing') return;
    
    // Check which key is pressed (case-insensitive for WASD)
    const key = e.key;
    const isUp = key === 'ArrowUp' || key.toLowerCase() === 'w';
    const isDown = key === 'ArrowDown' || key.toLowerCase() === 's';
    const isLeft = key === 'ArrowLeft' || key.toLowerCase() === 'a';
    const isRight = key === 'ArrowRight' || key.toLowerCase() === 'd';
    
    if (!(isUp || isDown || isLeft || isRight)) return;

    // Prevent scrolling when using arrow keys
    e.preventDefault();
    
    const [y, x] = playerPos;
    let ny = y, nx = x;
    
    if (isUp) ny -= 1;
    else if (isDown) ny += 1;
    else if (isLeft) nx -= 1;
    else if (isRight) nx += 1;

    if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
      if (grid[ny][nx] === 0) {
        setPlayerPos([ny, nx]);
        setMoves(m => m + 1);
        setHintPath([]); // Clear hints on move
        
        // Check win condition
        if (ny === endPos[0] && nx === endPos[1]) {
          const levelScore = Math.max(0, 1000 - timeElapsed * 2 - moves * 2);
          setScore(s => s + levelScore);
          setGameStatus('win');
        }
      }
    }
  }, [playerPos, grid, gameStatus, endPos, timeElapsed, moves]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleHint = async () => {
    if (gameStatus !== 'playing') return;
    try {
      const data = await getHint(grid, playerPos, endPos);
      if (data.next_move) {
        setHintPath([playerPos, data.next_move]);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-6xl">
      {/* Side Panel */}
      <div className="flex flex-col gap-6 w-full md:w-80 p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Smart AI Maze
          </h1>
          {gameStatus !== 'menu' && (
            <p className="text-slate-400 mt-2 font-medium bg-slate-800 py-1 px-3 rounded-full inline-block">
              Level {currentLevel?.level} <span className="text-slate-500">({currentLevel?.size}x{currentLevel?.size})</span>
            </p>
          )}
        </div>

        {gameStatus === 'playing' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center border border-slate-700">
                <span className="text-slate-400 text-sm">Time</span>
                <span className="text-2xl font-bold text-slate-100">
                  {timeElapsed}s
                </span>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center border border-slate-700">
                <span className="text-slate-400 text-sm">Moves</span>
                <span className="text-2xl font-bold text-slate-100">{moves}</span>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl flex flex-col items-center border border-slate-700">
              <span className="text-slate-400 text-sm">Score</span>
              <span className="text-3xl font-bold text-blue-400">{score}</span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button onClick={handleHint} className="flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 p-3 rounded-lg transition-all border border-yellow-500/20">
                <Brain size={18} /> Get AI Hint
              </button>
              <button onClick={restartLevel} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 p-3 rounded-lg transition-all mt-2">
                <RotateCcw size={18} /> Restart Level
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-4">Use WASD or Arrow Keys to move.</p>
          </>
        )}
      </div>

      {/* Main Board Area */}
      <div className="relative flex items-center justify-center min-h-[500px]">
        <AnimatePresence mode="wait">
          {gameStatus === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 p-10 rounded-2xl flex flex-col items-center text-center max-w-md shadow-2xl"
            >
              <Brain size={64} className="text-blue-500 mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Ready to test your wits?</h2>
              <p className="text-slate-400 mb-8">Navigate through 5 increasingly difficult AI-generated mazes. Race against the clock and optimize your moves.</p>
              <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition-transform hover:scale-105">
                <Play fill="currentColor" /> Start Challenge
              </button>
            </motion.div>
          )}

          {gameStatus === 'playing' && (
            <motion.div
              key={`maze-${levelIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MazeBoard 
                grid={grid} 
                playerPos={playerPos} 
                startPos={startPos} 
                endPos={endPos} 
                hintPath={hintPath}
              />
            </motion.div>
          )}

          {gameStatus === 'win' && (
            <motion.div
              key="win"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
            >
              <div className="bg-slate-900 border border-green-500/30 p-8 rounded-2xl text-center shadow-2xl shadow-green-500/10">
                <h2 className="text-4xl font-bold text-green-500 mb-2">Level Complete!</h2>
                <p className="text-slate-300 mb-6">You finished in {timeElapsed}s with {moves} moves.</p>
                <button onClick={nextLevel} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-transform hover:scale-105">
                  Next Level
                </button>
              </div>
            </motion.div>
          )}

          {gameStatus === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
            >
              <div className="bg-slate-900 border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl shadow-yellow-500/10 max-w-md cursor-default">
                <Trophy size={64} className="text-yellow-500 mb-6 mx-auto" />
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">Challenge Conquered!</h2>
                <p className="text-slate-300 mb-2">You beat all 5 levels like a true master.</p>
                <p className="text-2xl font-bold text-blue-400 mb-8">Final Score: {score}</p>
                <button onClick={() => setGameStatus('menu')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
