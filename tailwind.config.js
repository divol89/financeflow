module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "fondo-waves": "url('/img/WAVES.png')",
        "fondo-fondo": "url('/img/fondomoney.png')",
        "fondo-parilla": "url('/img/parilla.png')",
        whitepaperfondo: "url('/img/whitepaperfondo.png')",
        farmbanner: "url('/img/farmbanner.png')",
        "flow-gradient": "linear-gradient(to bottom, var(--tw-gradient-stops))",
      },
      inset: {
        "1px": "1px",
      },
      spacing: {
        "word-1": "0.25rem",
        "word-2": "0.5rem",
        "word-3": "0.75rem",
      },
      screens: {
        mf: "990px",
        largo: "375px",
        extralargo: "425px",
        tabblet: "768px",
        medium: { min: "640px", max: "768px" },
        mediumlarge: { min: "768px", max: "990px" },
        mediumbig: { min: "990px", max: "1023px" },
        peque: { min: "320px", max: "334px" },
      },
      keyframes: {
        "fade-in-scroll": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "fade-in-scroll": "fade-in-scroll 0.3s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
      },
      borderColor: {
        border: "var(--border)",
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        border: "var(--border)",
        // ... otros colores personalizados que puedas necesitar
        "flow-from": "#111827", // gray-900
        "flow-to": "#1f2937", // gray-800
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
