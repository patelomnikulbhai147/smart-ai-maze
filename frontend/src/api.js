const API = "https://smart-ai-maze-backend.onrender.com";

export async function generateMaze(width, height) {
  const res = await fetch(`${API}/generate-maze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ width, height })
  });
  return res.json();
}

export async function getHint(grid, start, end) {
  const res = await fetch(`${API}/get-hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid, start, end })
  });
  return res.json();
}