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
