import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import './assets/main.css'

const app = createApp(App)

// 全局配置
app.config.globalProperties.$echarts = echarts

// 开发环境下的调试信息
if (process.env.NODE_ENV === 'development') {
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err)
    console.error('Error Info:', info)
  }
  
  app.config.warnHandler = (msg, vm, trace) => {
    console.warn('Vue Warning:', msg)
    console.warn('Warning Trace:', trace)
  }
}

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')

// 开发环境下输出调试信息
if (process.env.NODE_ENV === 'development') {
  console.log('App initialized')
}