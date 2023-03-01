import {defineConfig} from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  base: "/OnlineCodeEditor/dist/",
  plugins: [framework()]
})
