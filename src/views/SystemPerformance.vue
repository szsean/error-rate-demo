<template>
  <div class="system-performance">
    <system-usage :cpu-data="cpuData" :memory-data="memoryData" />
  </div>
</template>

<script>
import SystemUsage from '../components/SystemUsage.vue'

export default {
  name: 'SystemPerformance',
  components: {
    SystemUsage
  },
  data() {
    return {
      // 模拟CPU数据：60天完整数据，但中间有一些缺失值
      cpuData: Array.from({ length: 60 }, (_, i) => {
        // 模拟某些天数据缺失的情况
        if (i === 15 || i === 16 || i === 30) {
          return null
        }
        return Math.floor(Math.random() * 40 + 30)
      }),

      // 模拟内存数据：只有58天数据，且有一些缺失值
      memoryData: Array.from({ length: 58 }, (_, i) => {
        // 模拟不连续的数据缺失
        if (i === 10 || i === 25 || i === 26 || i === 40) {
          return null
        }
        return Math.floor(Math.random() * 30 + 50)
      })
    }
  }
}
</script>

<style scoped>
.system-performance {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style> 