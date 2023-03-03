import {defineConfig} from 'vite'
export default defineConfig({
  base: "./dist/",
  server: {
    hmr: {
      clientPort: 443,
    },
  },
  
})
