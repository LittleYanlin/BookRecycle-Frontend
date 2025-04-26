<template>
<el-button 
  class="menu-toggle"
  @click="toggleMenu($event)"
  :icon="menuVisible ? Close : Menu"
  circle
  size="medium"
  :style="{ left: buttonPosition }"
/>
  <el-aside :style="asideStyle">
        <el-menu router unique-opened>
            <el-sub-menu index="1" v-show="role=='1'">
                <template #title>
                    <el-icon><Reading /></el-icon><span>我要卖书</span>
                </template>
                <el-menu-item index="/official/upload">
                    <el-icon><Upload /></el-icon><span>上传旧书信息</span>
                </el-menu-item>
                <el-menu-item index="/official/check_order">
                    <el-icon><Money /></el-icon><span>查看订单</span>
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2" v-show="role=='1'">
                <template #title>
                    <el-icon><Refresh /></el-icon><span>旧书再利用</span>
                </template>
                <el-menu-item index="/store/buy"><el-icon><Switch /></el-icon><span>购买/上传旧书</span></el-menu-item>
                <el-menu-item index="/store/check_order">
                    <el-icon><Money /></el-icon><span>查看订单</span>
                </el-menu-item>
                <el-menu-item index="/store/check_report">
                    <el-icon><Check /></el-icon><span>查看举报</span>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/message" v-show="role=='1'">
                <el-icon><ChatDotSquare /></el-icon><span>聊天</span>
            </el-menu-item>
            <el-sub-menu index="3" v-show="role=='2'">
                <template #title>
                    <el-icon><MessageBox /></el-icon><span>收书订单</span>
                </template>
                <el-menu-item index="/booker/get_order"><el-icon><Switch /></el-icon><span>领取任务</span></el-menu-item>
                <el-menu-item index="/booker/check_order">
                    <el-icon><Money /></el-icon><span>查看任务</span>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/user">
                <el-icon><User /></el-icon><span>个人信息</span>
            </el-menu-item>
            <el-sub-menu index="4" v-show="role=='3'">
                <template #title>
                    <el-icon><Setting /></el-icon><span>管理员</span>
                </template>
                <el-menu-item index="/admin/user"><el-icon><User /></el-icon><span>用户管理</span></el-menu-item>
                <el-menu-item index="/admin/score"><el-icon><Star /></el-icon><span>信誉分管理</span></el-menu-item>
                <el-menu-item index="/admin/content"><el-icon><Document /></el-icon><span>内容管理</span></el-menu-item>
                <el-menu-item index="/admin/admin"><el-icon><UserFilled /></el-icon><span>管理员管理</span></el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted ,computed} from 'vue';
import { useGloble } from '@/stores';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const store = useGloble();
const token = Cookies.get("access_token") as string
const role = ref(jwtDecode(token).role)
const menuVisible = ref(false)
import { Menu, Close } from '@element-plus/icons-vue'
const asideWidth = computed(() => store.isCollapse ? 64 : 200)
const buttonPosition = computed(() => {
  return menuVisible.value ? `${asideWidth.value + 20}px` : '20px'
})
function toggleMenu(event: Event){
  event.stopPropagation();
  menuVisible.value = !menuVisible.value;
}
const asideStyle = computed(() => ({
  width: menuVisible.value ? `${asideWidth.value}px` : '0',
  left: '0',
  transition: 'width 0.3s ease'
}))
function handleClickOutside(event: MouseEvent){
  const menuElement = document.querySelector('.el-aside')
  const buttonElement = document.querySelector('.el-button')
  if (
    menuElement && !menuElement.contains(event.target as Node) &&
    buttonElement && !buttonElement.contains(event.target as Node)
  ) {
    menuVisible.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style scoped>
.menu-toggle {
  position: fixed;
  top: 20px;
  z-index: 2000;
  transition: left 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: white;
}
.el-aside {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  z-index: 2000;
}
.el-menu {
  min-width: 200px;
  padding-top: 60px;
}
</style>