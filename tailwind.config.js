/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        secondaryBg: '#F1F5F9',
        primaryBlue: '#2563EB',
        secondaryTeal: '#0D9488',
        primaryText: '#1E293B',
        secondaryText: '#64748B',
        borders: '#D9E1EA',
        wallCell: '#334155',
        unvisitedCell: '#FFFFFF',
        exploredCell: '#BFDBFE',
        frontierCell: '#A5F3FC',
        finalPath: '#FBBF24',
        startNode: '#16A34A',
        goalNode: '#DC2626'
      }
    },
  },
  plugins: [],
}
