import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#14213d", ocean: "#246bce", mint: "#dff7ed", paper: "#f7f9fc" }, boxShadow: { soft: "0 12px 36px rgba(20,33,61,.08)" } } },
  plugins: []
};
export default config;
