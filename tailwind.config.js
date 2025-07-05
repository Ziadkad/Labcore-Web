/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6dd7fd',        // Sidebar / Header
        accent: '#bef0ff',      // Buttons / Active items
        secondary: '#bef0ff',
        third: '#005acd',
        white: '#f5ffff',
        card: '#F8FAFC',
        status: {
          inProgress: '#10B981',   // Green
          completed: '#3B82F6',    // Blue
          pending: '#F87171',      // Red
        },
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
