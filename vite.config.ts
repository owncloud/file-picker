import path from 'path'
import { BuildOptions, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const lib: BuildOptions['lib'] = {
  entry: path.resolve(__dirname, './src/main.lib.ts'),
  name: 'OCFilePicker',
  fileName: 'file-picker',
  formats: ['es', 'umd']
}

const wc: BuildOptions['lib'] = {
  entry: path.resolve(__dirname, './src/main.wc.ts'),
  name: 'OCFilePicker',
  fileName: 'file-picker',
  formats: ['es', 'umd', 'iife']
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      basicSsl(),
      vue(),
      nodePolyfills({ protocolImports: true }),
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, './node_modules/owncloud-design-system/dist/system/icons'),
            dest: path.resolve(__dirname, mode === 'library' ? './dist/lib/' : './dist/wc/')
          },
          {
            src: path.resolve(__dirname, './node_modules/owncloud-design-system/dist/system/fonts'),
            dest: path.resolve(__dirname, mode === 'library' ? './dist/lib/' : './dist/wc/')
          }
        ]
      })
    ],
    resolve: {
      alias: [
        {
          find: '~',
          replacement: path.resolve(__dirname, './')
        },
        {
          find: 'stream',
          replacement: `stream-browserify`
        }
      ]
    },
    preview: {
      https: true,
      port: 3000,
      host: 'host.docker.internal'
    },
    build: {
      outDir: mode === 'library' ? './dist/lib' : './dist/wc',
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
    optimizeDeps: {
      include: ['@ownclouders/web-client']
    },
    define: {
      'process.env.NODE_ENV': `"${env.NODE_ENV}"`
    }
  }
})
