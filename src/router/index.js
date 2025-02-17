import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import AccuracyAnalysis from '../views/AccuracyAnalysis.vue'
import SystemPerformance from '../views/SystemPerformance.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/accuracy'
      },
      {
        path: '/accuracy',
        name: 'AccuracyAnalysis',
        component: AccuracyAnalysis
      },
      {
        path: '/performance',
        name: 'SystemPerformance',
        component: SystemPerformance
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
  console.log('Current route:', to.path)
  next()
})

export default router 