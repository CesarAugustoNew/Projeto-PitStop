import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      // Pôsteres de filmes enviados pelo admin ficam salvos no back-end
      // e são servidos em /uploads/**. Sem esse proxy, o navegador
      // pede a imagem em localhost:3000/uploads/... (o próprio Vite)
      // e recebe 404, em vez de ir para o back-end na porta 8080.
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})