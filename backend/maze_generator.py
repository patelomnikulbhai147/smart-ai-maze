import random

def generate_maze(width, height):
    # Dimensions for grid representation (1=wall, 0=path)
    grid_width = 2 * width + 1
    grid_height = 2 * height + 1
    
    # Initialize full grid with walls
    maze = [[1 for _ in range(grid_width)] for _ in range(grid_height)]
    
    def carve_path(cx, cy):
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        random.shuffle(directions)
        
        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy
            # Check 2 steps away
            check_x, check_y = cx + 2 * dx, cy + 2 * dy
            
            if 1 <= check_y < grid_height - 1 and 1 <= check_x < grid_width - 1:
                if maze[check_y][check_x] == 1:
                    # Carve through
                    maze[ny][nx] = 0
                    maze[check_y][check_x] = 0
                    carve_path(check_x, check_y)

    start_x, start_y = 1, 1
    maze[start_y][start_x] = 0
    carve_path(start_x, start_y)
    
    # Depending on dimensions, we place the end at the furthest bottom-right carved cell
    end_x, end_y = grid_width - 2, grid_height - 2
    # Ensure end is open (though recursive backtracking visits everything)
    maze[end_y][end_x] = 0
    
    return {
        "grid": maze,
        "start": [start_y, start_x],
        "end": [end_y, end_x],
        "size": [grid_height, grid_width]
    }
