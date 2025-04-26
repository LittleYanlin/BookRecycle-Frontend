<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 根据isMobile的值动态显示Aside -->
      <el-container v-if="!isMobile" class="main-container">
        <Aside class="aside" />
        <el-container direction="vertical" class="header-and-main">
          <Header />
          <el-main>
            <el-scrollbar>
              <RouterView />
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
      <!-- 在移动端显示的布局 -->
      <el-container v-else class="main-container">
        <el-container direction="vertical" class="header-and-main">
          <Header />
          <el-main>
            <el-scrollbar>
              <RouterView />
            </el-scrollbar>
          </el-main>
        </el-container>
        <Aside class="aside-bottom" />
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'

const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>
<style scoped>
.header-and-main {
  flex-direction: column;
  height: 100vh;
}

.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.aside {
  width: 250px;
}

.aside-bottom {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

@media (max-width: 768px) {
  .header-and-main {
    flex-direction: column;
    height: auto;
  }

  .aside {
    display: none;
  }

  .aside-bottom {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 10;
  }

  .layout-container {
    flex-direction: column;
  }
}
</style>
