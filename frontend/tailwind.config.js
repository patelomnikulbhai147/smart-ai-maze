/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maze: {
          bg: '#0f172a',    // slate-900
          wall: '#334155',  // slate-700
          path: '#1e293b',  // slate-800
          player: '#3b82f6', // blue-500
          start: '#22c55e',  // green-500
          end: '#ef4444',    // red-500
          hint: '#eab308'    // yellow-500
        }
      }
    },
  },
  plugins: [],
}
