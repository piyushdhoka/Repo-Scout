import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-radix': ['@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-slot'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'icons': ['lucide-react', '@tabler/icons-react'],
          'query': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000 KB
  },
}));
