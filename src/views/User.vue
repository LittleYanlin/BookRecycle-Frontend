<template>
    <h1>个人信息维护</h1>
    <el-form class="login-form">
      <el-form-item label="更改密码"  >
        <el-input v-model="new_password" type="password"/>
      </el-form-item>
      <el-form-item label="姓名"  v-show="role=='2'">
        <el-input v-model="name" disabled="true"/>
      </el-form-item>
      <el-form-item label="电话"  v-show="role=='1'||role=='2'">
        <el-input v-model="new_phone"/>
      </el-form-item>
      <el-form-item label="宿舍楼地址"  v-show="role=='1'">
        <el-input v-model="new_address"/>
      </el-form-item>
      <el-form-item label="收款地址"  v-show="role=='1'">
        <el-input v-model="shoukuan"/>
      </el-form-item>
      <el-form-item label="账户余额"  v-show="role=='1'||role=='2'">
        <el-input disabled="true" v-model="money"/>
      </el-form-item>
      <el-form-item label="信誉分"  v-show="role=='1'">
        <el-input disabled="true" v-model="score"/>
      </el-form-item>
      <el-form-item label="校区"  v-show="role=='1'||role=='2'">
        <el-select v-model="new_place" placeholder="请选择你的校区">
          <el-option label="朝晖" value="1" />
          <el-option label="屏峰" value="2" />
          <el-option label="莫干山" value="3" />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item label="用户管理权限"  v-show="role=='3'">
        <el-input disabled="true" v-model="user_manage"/>
      </el-form-item>
      <el-form-item label="信誉分管理权限"  v-show="role=='3'">
        <el-input disabled="true" v-model="score_manage"/>
      </el-form-item>
      <el-form-item label="内容管理权限"  v-show="role=='3'">
        <el-input disabled="true" v-model="content_manage"/>
      </el-form-item>
        <el-form-item label="超级管理员"  v-show="role=='3'">
        <el-input disabled="true" v-model="super_admin"/>
      </el-form-item>
      </div>
  </el-form>
  <el-button class="login-button" type="primary" @click="changeData">确认更改</el-button>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
const user=ref(Cookies.get('username') as string)
const pass=ref(Cookies.get('password') as string)
const token = Cookies.get("access_token") as string
const role=ref(jwtDecode(token).role)
const router=useRouter()
let new_password=ref(''),new_phone=ref(''),new_address=ref(''),shoukuan=ref(''),new_place=ref(''),money=ref(''),
score=ref(''),name=ref(''),user_manage=ref(''),score_manage=ref(''),content_manage=ref(''),super_admin=ref('')
async function getdata(){
    try{
    const header={Authorization:"Bearer "+Cookies.get("access_token")}
    const result=await axios.get('/api/manage/'+role.value,{headers:header})
    if(result.data.status==1){
        new_phone.value=result.data.data.phone
        new_place.value=result.data.data.place
        new_address.value=result.data.data.address
        shoukuan.value=result.data.data.shoukuan
        money.value=result.data.data.money
        score.value=result.data.data.score
        name.value=result.data.data.name
        user_manage.value=result.data.data.user_manage?"是":"否"
        score_manage.value=result.data.data.score_manage?"是":"否"
        content_manage.value=result.data.data.content_manage?"是":"否"
        super_admin.value=result.data.data.super_admin?"是":"否"
    }
    else{
        ElMessage({
            message:result.data.message,
            type:"error"
        })
    }
    }
    catch{
        ElMessage({
            message:"后端连接失败",
            type:'error'
        })
    }
}
async function changeData() {
    try{
    const Data=new FormData()
    const header={Authorization:"Bearer "+Cookies.get("access_token")}
    Data.append("new_pass",new_password.value)
    Data.append("place",new_place.value)
    Data.append("address",new_address.value)
    Data.append("shoukuan",shoukuan.value)
    Data.append("phone",new_phone.value)
    const result=await axios.post('/api/manage/'+role.value,Data,{headers:header})
    if(result.data.status==1){
        ElMessage({
            message:result.data.message,
            type:"success"
        })
        if(new_password.value!=''){
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          ElMessage.info('退出登录成功！请重新登录');
          router.push('/login');
        }
    }
    else{
        ElMessage({
            message:result.data.message,
            type:"error"
        })
    }
    }
    catch{
        ElMessage({
            message:"后端连接失败",
            type:'error'
        })
    }
}
onMounted(()=>{getdata()})
</script>
<style scoped>
.login-form {
  max-width: 600px;
  margin: 30px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}
.el-form-item {
  margin-bottom: 22px;
}
.el-form-item:last-child {
  margin-bottom: 0;
}
.el-input,
.el-select {
  width: 100%;
}
.el-input :deep(.el-input__wrapper) {
  border-radius: 4px;
  transition: all 0.3s ease;
}
.el-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}
.el-select :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}
.login-button {
  display: block;
  width: 200px;
  margin: 30px auto;
  border-radius: 20px;
  background: #409eff;
  transition: all 0.3s ease;
}
.login-button:hover {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
.el-form-item :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  padding-right: 20px;
}
.el-input.is-disabled :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: 0 0 0 1px #e4e7ed inset;
}
@media (max-width: 768px) {
  .login-form {
    padding: 20px;
    margin: 20px;
  }
  h1 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>