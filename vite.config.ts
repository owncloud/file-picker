import path from 'path'
import { BuildOptions, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { loadEnv } from 'vite'

const lib: BuildOptions['lib'] = {
  entry: path.resolve(__dirname, './src/main.lib.ts'),
  name: 'OCFilePicker',
  fileName: 'file-picker',
  formats: ['es', 'umd']
}

const wc: BuildOptions['lib'] = {
  entry: path.resolve(__dirname, './src/main-wc.ts'),
  name: 'OCFilePicker',
  fileName: 'file-picker',
  formats: ['es', 'umd', 'iife']
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [basicSsl(), vue()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        {
          find: 'stream',
          replacement: `stream-browserify`
        }
      ]
    },
    preview: {
      https: true,
      port: 8080,
      host: 'host.docker.internal'
    },
    build: {
      outDir: mode === 'library' ? './dist/lib' : './dist/wc',
      cssCodeSplit: false,
      lib: mode === 'library' ? lib : wc,
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      },
      commonjsOptions: {
        ignoreTryCatch: (id) => id !== 'stream'
      }
    },
    define: {
      'process.env.NODE_ENV': `"${env.NODE_ENV}"`
    }
  }
})
