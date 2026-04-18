import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/shop/', //打包路径
  plugins: [
    vue(),
    vueSetupExtend(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icon')],
      // 指定symbolId格式
      symbolId: 'svg-[name]',
    }),
    // gzip压缩 生产环境生成 .gz 文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  //启动服务配置
  server: {
    host: '0.0.0.0',
    port: 9001,
    open: true,
    https: false,
    // 配置跨域处理
    proxy: {
      '/v1': {
        target: 'https://r.xcx100.info/bar-manager-api',
        changeOrigin: true,
      },
    },
  },
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 生产环境打包配置
  //去除 console debugger
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        //静态资源分类打包
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          //静态资源分拆打包
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
  },
})
