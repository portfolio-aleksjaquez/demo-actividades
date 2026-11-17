import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  base: '/demo-actividades/',
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        mariposa: page('./ciclo-mariposa/index.html'),
        fracciones: page('./fracciones/index.html'),
        sistemaSolar: page('./sistema-solar/index.html'),
      },
    },
  },
});
