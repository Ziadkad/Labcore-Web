/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13304c',        // Sidebar / Header
        accent: '#336fae',      // Buttons / Active items
        secondary: '#1a4263',
        white: '#fff',
        card: '#F8FAFC',           // Background for panels
        textDark: '#1E293B',       // For titles
        textMuted: '#64748B',      // For secondary text
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
