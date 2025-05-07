<template>
    <div>
      <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="score" label="信誉分" />
        <el-table-column prop="money" label="余额" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogVisible" title="编辑用户" style="width: 80%;">
        <el-form label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editUser.username" disabled />
          </el-form-item>
          <el-form-item label="更改密码">
            <el-input v-model="new_pass" type="password"/>
          </el-form-item>
          <el-form-item label="信誉分">
            <el-input v-model="editUser.score" type="number" :max="100"/>
          </el-form-item>
          <el-form-item label="余额">
            <el-input v-model="editUser.money" type="number" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="editUser.phone" disabled/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import axios from 'axios';
  import Cookies from 'js-cookie';
  const users = ref([])
  const loading = ref(false)
  const dialogVisible = ref(false)
  const editUser = ref({
    id:'',
    username: '',
    place: '',
    score: '',
    money: '',
    phone: '',
    new_pass:''
})
const new_pass=ref('')
async function fetchUsers(){
    loading.value = true
    try {
      const response = await axios.get('/api/admin/user/stu',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
      if (response.data.status === 1) {
        users.value = response.data.data
      } else {
        ElMessage.error(response.data.message)
      }
    } catch (error) {
      ElMessage.error('请求失败')
    } finally {
      loading.value = false
    }
  }

  function openEditDialog(user:any){
    editUser.value = user
    dialogVisible.value = true
  }
  async function saveUser(){
    try {
    const Data=new FormData()
    Data.append("new_pass",new_pass.value)
    Data.append ("id",editUser.value.id)
    Data.append ("money",editUser.value.money)
    Data.append ("score",editUser.value.score)
      const response = await axios.post('/api/admin/user/stu_manage',Data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
      if (response.data.status === 1) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchUsers()
      } else {
        ElMessage.error(response.data.message)
      }
    } catch (error) {
      ElMessage.error('请求失败')
    }
  }
  onMounted(fetchUsers)
  </script>
  <style scoped>
  .el-table {
    margin-bottom: 20px;
  }
  </style>
  