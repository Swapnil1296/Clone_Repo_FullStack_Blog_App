import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://clone-repo-fullstack-blog-app-1.onrender.com",
  //       secure: false,
  //     },
  //   },
  // },
  plugins: [react()],
});
