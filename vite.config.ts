import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/DZpoWeb8/', // замени на точное имя репозитория на GitHub
})