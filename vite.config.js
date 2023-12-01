import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { terser } from 'rollup-plugin-terser';
import cssnano from 'cssnano';

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    terser({ compress: { drop_console: true } }),
    cssnano({ preset: 'default' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'esbuild',
    outDir: 'christmas',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/') && id.endsWith('.js')) {
            const size = id.length / 1024; // 文件大小，单位为 KB
            if (size > 500) {
              return `vendor-${id}`; // 将大于 500KB 的文件拆分到单独的 chunk
            }
          }
        },
      },
    },
  },
});
