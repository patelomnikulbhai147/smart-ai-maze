# Smart AI Maze Challenge

A premium full-stack AI-based Maze Game.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (v3), Framer Motion, Lucide React
- **Backend**: Python, Flask, Flask-CORS

## Features
- Dynamic Grid Maze Generation (DFS Recursive Backtracking)
- A* Algorithm for Pathfinding (Hint system and Solve Path)
- Framer Motion enhanced glowing neon UI
- Level System (8x8 up to 20x20)
- Countdown Timers and Scoring

## Setup Instructions

### 1. Start the Backend (API)
Open a terminal window and run:
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*The backend API will run on http://localhost:5000*

### 2. Start the Frontend (React UI)
Open a second terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
*The React app will usually run on http://localhost:5173*

## AI Concepts Explained
- **Recursive Backtracking**: This creates a "perfect maze" (no loops, exactly one path between any two points) by randomly carving paths until it hits a dead end, then backtracking to previous cells to carve new paths.
- **A* Algorithm**: A pathfinding algorithm that finds the shortest path by combining actual distance from the start (`g_cost`) with a "heuristic" or estimated distance to the end (`h_cost`). We use Manhattan Distance (total vertical+horizontal steps) for our heuristic.
