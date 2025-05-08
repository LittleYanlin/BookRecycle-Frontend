<template>
    <div class="login-container">
        <h2>欢迎登录！</h2>
        <el-text>学生账号不需要注册，使用学号登录，密码为zjut+学号后六位</el-text>
        <el-form class="login-form" @submit.prevent="handleLogin">
            <el-form-item label="用户名">
                <el-input v-model="username" placeholder="请输入用户名/学号" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="password" type="password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="角色" :rules="[ { required: true, message: '请选择角色', trigger: 'blur' } ]">
            <el-select v-model="role" placeholder="请选择角色">
              <el-option label="学生" value="1" />
              <el-option label="收书员" value="2" />
              <el-option label="管理员" value="3" />
            </el-select>
          </el-form-item>
            <el-button class="login-button" type="primary" @click="handleLogin_first">登录</el-button>
            <el-button class="login-button" type="primary" @click="router.push('/reg')">收书员注册</el-button>
        </el-form>
    </div>
    <el-dialog v-model="firstVisible" title="首次登录信息补充" width="500">
    <el-form>
        <el-text type="warning" size="small">密码必须大于8位小于20位且必须包含大小写字母、数字和特殊符号</el-text>
      <el-form-item label="更改密码" label-width="140px" >
        <el-input v-model="new_password" type="password"/>
      </el-form-item>
      <el-form-item label="电话" label-width="140px" >
        <el-input v-model="new_phone"/>
      </el-form-item>
      <el-form-item label="宿舍楼地址" label-width="140px" >
        <el-input v-model="new_address"/>
      </el-form-item>
      <el-form-item label="收款地址" label-width="140px" >
        <el-input v-model="shoukuan"/>
      </el-form-item>
      <el-form-item label="校区" label-width="140px">
        <el-select v-model="new_place" placeholder="请选择你的校区">
          <el-option label="朝晖" value="1" />
          <el-option label="屏峰" value="2" />
          <el-option label="莫干山" value="3" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="firstVisible = false">取消</el-button>
        <el-button type="primary" @click="upload_first_data()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import Cookies from 'js-cookie';
import { useRouter } from "vue-router";
const username = ref('');
const password = ref(''),firstVisible=ref(false)
const isLogin=ref(false)
const router=useRouter()
const role=ref(''),new_password=ref(''),new_phone=ref(''),new_place=ref(''),new_address=ref(('')),shoukuan=ref('')
onMounted(()=>{
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('role')
})
async function upload_first_data(){
    if(isLogin.value){
        ElMessage({
            message:'请勿重复点击登录！',
            type:"info"
        })
        return
    }
    isLogin.value=true
    try{
        let Data = new FormData()
        Data.append('username',username.value)
        Data.append('password',new_password.value)
        Data.append('role',"1")
        Data.append('shoukuan',shoukuan.value)
        Data.append('place',new_place.value)
        Data.append('phone',new_phone.value)
        Data.append('address',new_address.value)
        if(new_password.value==''||shoukuan.value==''||new_place.value==''||new_phone.value==''||new_address.value==''){
            ElMessage.error("请检查你填写的信息！")
            return
        }
        const result=await axios.post('/api/reg',Data)
        if(result.data.status==1){
            ElMessage({
                message:"登录成功！",
                type:"success"
            })
            Cookies.set('access_token',result.data.access_token,{ expires: 1, path: '' })
            Cookies.set('refresh_token',result.data.refresh_token,{ expires: 7, path: '' })
            Cookies.set('role',"1",{ expires: 7, path: '' })
            isLogin.value=false
            router.push('/')
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
            message:"登录失败，后端连接失败",
            type:"error"
        })
    }
    finally{
        isLogin.value=false
    }
}
async function handleLogin_first(){
    try{
    let Data = new FormData()
    Data.append('username',username.value)
    Data.append('password',password.value)
    Data.append('role',role.value)
    const result=await axios.post('/api/check_first_login',Data)
    if(result.data.status==1){
        if(result.data.result){
            ElMessage({
                message:"你是第一次登录，需要补充信息！",
                type:"info"
            })
            firstVisible.value=true
        }
        else{
            handleLogin()
        }
    }
    else{
        ElMessage({
            message:result.data.message,
            type:"error"
        })
    }
    }
    catch(error){
        ElMessage({
            message:"登录出错！无法验证是否为第一次登录",
            type:"error"
        })
    }
}
async function handleLogin(){
    let Data = new FormData();
    if(isLogin.value){
        ElMessage({
            message:'请勿重复点击登录！',
            type:"info"
        })
        return
    }
    isLogin.value=true
    try {
        if(username.value==''||password.value==''||role.value==''){
            ElMessage({
            message:'请检查你所填写的信息！',
            type:"error"
        })
        isLogin.value=false
        return
        }
        Data.append('username',username.value)
        Data.append('password',password.value)
        Data.append('role',role.value)
        const response = await axios.post("/api/login",Data);
        if (response.data.status === 1) {
            ElMessage({
                message:'登录成功！',
                type:'success'
            })
            Cookies.set('access_token',response.data.access_token,{ expires: 1, path: '' })
            Cookies.set('refresh_token',response.data.refresh_token,{ expires: 7, path: '' })
            Cookies.set('role',role.value,{ expires: 7, path: '' })
            Cookies.set('username',username.value,{ expires: 7, path: '' })
            isLogin.value=false
            router.push('/')
        } else {
            ElMessage({
                message:response.data.message,
                type:'error'
            })
            isLogin.value=false
        }
    } catch (error) {
        ElMessage({
                message:'登录请求失败',
                type:'error'
            })
            isLogin.value=false
    }
}
</script>
<style scoped>
.login-container {
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
.login-form {
    display: flex;
    flex-direction: column;
}
.login-button {
    width: 100%;
    margin-top: 10px;
    font-size: 16px;
}
@media (max-width: 400px) {
    .login-container {
        width: 90%;
        padding: 20px;
    }
}
</style>
