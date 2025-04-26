<template>
    <div class="register-container">
      <el-card>
        <h2>收书员注册</h2>
        <el-form @submit.prevent="handleSubmit">
          <el-form-item label="学号" :rules="[ { required: true, message: '请输入用户名', trigger: 'blur' } ]">
            <el-input v-model="username" />
          </el-form-item>
          <el-form-item label="密码" :rules="[ { required: true, message: '请输入密码', trigger: 'blur' } ]">
            <el-input type="password" v-model="password" />
          </el-form-item>
          <el-form-item label="校区" :rules="[ { required: true, message: '请输入地址', trigger: 'blur' } ]">
            <el-select v-model="place" placeholder="请选择校区">
              <el-option label="朝晖" value= "1" />
              <el-option label="屏峰" value= "2" />
              <el-option label="莫干山" value= "3" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" :rules="[ { required: true, message: '请输入电话', trigger: 'blur' } ]">
            <el-input v-model="phone" />
          </el-form-item>
          <el-form-item label="姓名" :rules="[ { required: true, message: '请输入姓名', trigger: 'blur' } ]">
            <el-input v-model="name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="register-button" @click="handleSubmit">提交注册</el-button>
            <el-button type="primary" class="register-button" @click="router.push('/login')">返回</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router=useRouter()
let username=ref(''),password=ref(''),place=ref(''),phone=ref(''),name=ref('')
async function handleSubmit(){
    let Data=new FormData()
    Data.append("username",username.value)
    Data.append("password",password.value)
    Data.append("place",place.value)
    Data.append("phone",phone.value)
    Data.append("name",name.value)
    Data.append("role","2")
    if(username.value==''||password.value==''||place.value==''||phone.value==''||name.value==''){
      ElMessage.error("请检查你所填写的信息！")
      return
    }
    try {
        const response = await axios.post("/api/reg",Data);
        if (response.data.status === 1) {
            ElMessage({
                message:'注册成功！',
                type:'success'
            })
            router.push('/login')
        } else {
            ElMessage({
                message:response.data.message,
                type:'error'
            })
        }
    } catch (error) {
        ElMessage({
                message:'注册请求失败',
                type:'error'
            })
    }
}
</script>
<style scoped>
.register-container {
  width: 350px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
}

.success {
  color: green;
}

.error {
  color: red;
}

@media (max-width: 400px) {
  .register-container {
    width: 90%;
    padding: 20px;
  }
}
</style>