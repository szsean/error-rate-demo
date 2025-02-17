<template>
  <div class="app-wrapper">
    <!-- 侧边菜单 -->
    <div class="sidebar">
      <div class="logo">性能分析系统</div>
      <div class="menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          class="menu-item"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.title }}
        </router-link>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-container">
      <div class="header">
        <h2>{{ currentTitle }}</h2>
      </div>
      <div class="content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      menuItems: [
        { path: '/accuracy', title: '准确度分析' },
        { path: '/performance', title: '系统性能指标' }
      ]
    }
  },
  computed: {
    currentTitle() {
      const currentItem = this.menuItems.find(item => item.path === this.$route.path)
      return currentItem ? currentItem.title : ''
    }
  },
  mounted() {
    console.log('Layout mounted, current route:', this.$route.path)
  }
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}

.menu {
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  display: block;
  padding: 12px 20px;
  color: #bfcbd9;
  text-decoration: none;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.menu-item:hover {
  color: #fff;
  background-color: #263445;
}

.menu-item.active {
  color: #409EFF;
  background-color: #263445;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  background-color: #f0f2f5;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style> 