from flask import Flask, request, jsonify
from flask_cors import CORS
from maze_generator import generate_maze
from pathfinder import solve_maze_astar

app = Flask(__name__)
CORS(app)

@app.route('/generate-maze', methods=['POST'])
def api_generate_maze():
    data = request.json
    width = data.get('width', 8)
    height = data.get('height', 8)
    maze_data = generate_maze(width, height)
    return jsonify(maze_data)

@app.route('/get-hint', methods=['POST'])
def api_get_hint():
    data = request.json
    grid = data.get('grid')
    start = tuple(data.get('start')) # [y, x]
    end = tuple(data.get('end'))     # [y, x]
    
    if not grid or not start or not end:
        return jsonify({"error": "Invalid input"}), 400
        
    path = solve_maze_astar(grid, start, end)
    # The next move is the second cell in the path, as the first is the start cell
    next_move = path[1] if len(path) > 1 else (path[0] if path else list(start))
    
    return jsonify({"next_move": next_move})

@app.route('/solve-maze', methods=['POST'])
def api_solve_maze():
    data = request.json
    grid = data.get('grid')
    start = tuple(data.get('start'))
    end = tuple(data.get('end'))
    
    if not grid or not start or not end:
        return jsonify({"error": "Invalid input"}), 400
        
    path = solve_maze_astar(grid, start, end)
    return jsonify({"path": path})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
