/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		fontFamily: {
		  victory: ["victory", "sans-serif"],
		  inter: ["Inter", "sans-serif"],
		  gasoek: ["Gasoek One", "sans-serif"],
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  