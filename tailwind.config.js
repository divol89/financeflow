/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "fondo-waves": "url('/img/WAVES.png')",
        "fondo-fondo": "url('/img/fondomoney.png')",
        "fondo-parilla": "url('/img/parilla.png')",
        whitepaperfondo: "url('/img/whitepaperfondo.png')",
        farmbanner: "url('/img/farmbanner.png')",
        "flow-gradient": "linear-gradient(to bottom, var(--tw-gradient-stops))",
      },
      colors: {
        flow: {
          from: '#020617',
          to: '#111827',
        },
        muted: 'rgba(148, 163, 184, 0.12)',
        'muted-foreground': '#94a3b8',
        background: '#020617',
        foreground: '#f8fafc',
        ring: '#22d3ee',
        border: '#334155',
        input: '#334155',
        card: '#0f172a',
        'card-foreground': '#f8fafc',
      },
      fontSize: {
        xxs: '0.65rem',
      },
      keyframes: {
        'laser-glow': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-in-scroll': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'laser-glow': 'laser-glow 3s infinite',
        float: 'float 3s ease-in-out infinite',
        'fade-in-scroll': 'fade-in-scroll 0.3s ease-out',
        gradient: 'gradient 6s ease infinite',
      },
    },
  },
  plugins: [],
};
