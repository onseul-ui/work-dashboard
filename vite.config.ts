import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 상대 경로로 빌드: GitHub Pages(https://아이디.github.io/저장소명/)에서 저장소 이름과 무관하게 동작
  base: './',
});
