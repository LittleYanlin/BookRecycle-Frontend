<template>
  <el-header class="header">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="index"
        :to="item.path"
        class="breadcrumb-item"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown class="dropdown-right">
      <span class="el-dropdown-link">
        <span class="username">{{ username }}</span>
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="dropdown-menu">
          <el-dropdown-item @click="Logout" class="logout-btn">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';
import { jwtDecode } from 'jwt-decode';
const route = useRoute();
const router = useRouter();
const token = Cookies.get("access_token") as string
const username=ref(jwtDecode(token).sub)
const breadcrumbs = computed(() => {
  return route.matched
    .filter(r => r.meta && r.meta.title)
    .map(r => ({
      path: r.path,
      title: r.meta.title
    }))
})
function Logout() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('username');
  Cookies.remove('role');
  ElMessage.info('退出登录成功！请重新登录');
  router.push('/login');
}
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #fff;
}
.breadcrumb {
  margin-left: 20px;
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.breadcrumb-item {
  font-weight: 500;
  color: #fff !important;
  background: linear-gradient(135deg, #e0e0e0, #d0d0d0);
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}
.breadcrumb-item:hover {
  background: linear-gradient(135deg, #d0d0d0, #c0c0c0);
  transform: scale(1.05);
}
.dropdown-right {
  margin-left: auto;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}
.username {
  color: #333;
  font-size: 16px;
}
.dropdown-menu {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  color: #333;
}
.logout-btn {
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease-in-out;
}
.logout-btn:hover {
  background: #4a90e2;
  color: #fff;
  transform: scale(1.05);
}
@media (max-width: 768px) {
  .breadcrumb {
    display: none;
  }
  .header {
    padding: 0 10px;
  }
  .username {
    font-size: 14px;
  }
}
</style>