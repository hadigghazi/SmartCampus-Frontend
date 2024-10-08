import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.json',
        async: true,
      },
    }),
  ],
  assetsInclude: ["**/*.glb"],
  server: {
    host: true, 
    port: 3000
  }
})
