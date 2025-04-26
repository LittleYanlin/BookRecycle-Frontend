<template>
    <el-button @click="showAdd=true">添加管理员</el-button>
    <el-button @click="set">管理全局设置</el-button>
    <el-table :data="adminData" style="width: 100%" max-height="250" table-layout="auto" v-loading="!Loaded">
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="user_manage" label="用户管理权限"/>
      <el-table-column prop="score_manage" label="信誉分管理权限"/>
      <el-table-column prop="content_manage" label="内容管理权限"/>
      <el-table-column prop="super_admin" label="超级管理员权限"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deal(scope.row)"
          >
            管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="管理" style="width: 80%;">
        <el-form class="login-form">
      <el-form-item label="更改密码">
        <el-input v-model="adminDetail.password" type="password"/>
      </el-form-item>
      <el-form-item label="权限管理">
        <el-checkbox v-model="adminDetail.user_manage" label="用户管理" size="large" />
        <el-checkbox v-model="adminDetail.score_manage" label="信誉分管理" size="large" />
        <el-checkbox v-model="adminDetail.content_manage" label="内容管理" size="large" />
        <el-checkbox v-model="adminDetail.super_admin" label="超级管理员" size="large" />
      </el-form-item>
      </el-form>
      <el-button class="login-button" type="primary" @click="comfirm">确认更改</el-button>
      <el-button class="login-button" @click="showDetail=false">取消</el-button>
    </el-dialog>
    <el-dialog v-model="showAdd" title="添加用户" style="width: 80%;">
        <el-form class="login-form">
        <el-form-item label="用户名">
        <el-input v-model="addDetail.username" type="text"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="addDetail.password" type="password"/>
      </el-form-item>
      <el-form-item label="权限管理">
        <el-checkbox v-model="addDetail.user_manage" label="用户管理" size="large" />
        <el-checkbox v-model="addDetail.score_manage" label="信誉分管理" size="large" />
        <el-checkbox v-model="addDetail.content_manage" label="内容管理" size="large" />
        <el-checkbox v-model="addDetail.super_admin" label="超级管理员" size="large" />
      </el-form-item>
      </el-form>
      <el-button class="login-button" type="primary" @click="add">确认</el-button>
      <el-button class="login-button" @click="showAdd=false">取消</el-button>
    </el-dialog>
    <el-dialog v-model="showSet" title="全局设置" style="width: 90%;">
        <el-form class="login-form">
        <el-form-item label="单价（每千克）">
          <el-input-number v-model="setting.money_per_kg" :min="1" :max="100"/>
      </el-form-item>
      <el-form-item label="收书员获得奖励倍率">
        <el-input-number v-model="setting.rate" :min="0" :max="1" :precision="2" :step="0.1"/>
      </el-form-item>
      <el-form-item label="最低信誉分">
        <el-input-number v-model="setting.score" :min="0" :max="100"/>
      </el-form-item>
      </el-form>
      <el-button class="login-button" type="primary" @click="changeSet">确认</el-button>
      <el-button class="login-button" @click="showSet=false">取消</el-button>
    </el-dialog>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
const Loaded=ref(false),showDetail=ref(false),showAdd=ref(false),showSet=ref(false)
let adminData = ref<Array<any>>([])
const adminDetail = ref({
    username:'',
    password:'',
    user_manage:false,
    score_manage:false,
    content_manage:false,
    super_admin:false,
    id:''
})
const addDetail = ref({
    username:'',
    password:'',
    user_manage:false,
    score_manage:false,
    content_manage:false,
    super_admin:false,
})
const setting=ref({
  money_per_kg:10,
  rate:0.2,
  score:10
})
async function getdata(){
    try{
      Loaded.value=false
        const result=await axios.get('/api/admin/admin',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            adminData.value=result.data.result
            Loaded.value=true
        }
        else{
            ElMessage({
            message:result.data.message,
            type:'error'
        })
        }
    }
    catch(error){
        ElMessage({
            message:'后端请求失败',
            type:'error'
        })
    }
    finally{
        Loaded.value=true
    }
}
function deal(row:any){
    adminDetail.value=row
    showDetail.value=true
}
async function comfirm(){
    let data=new FormData()
    data.append("id",adminDetail.value.id)
    data.append("username",adminDetail.value.username)
    data.append("content_manage",adminDetail.value.content_manage?"1":"0")
    data.append("score_manage",adminDetail.value.score_manage?"1":"0")
    data.append("user_manage",adminDetail.value.user_manage?"1":"0")
    data.append("super_admin",adminDetail.value.super_admin?"1":"0")
    try{
        const result=await axios.post('/api/admin/admin',data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            ElMessage.success("成功！")
        }
        else{
            ElMessage.error(result.data.message)
        }
    }
    catch{
        ElMessage.error("后端连接失败！")
    }
    finally{
        showDetail.value=false
        getdata()
    }
}
async function add(){
    let data=new FormData()
    data.append("username",addDetail.value.username)
    data.append("password",addDetail.value.password)
    data.append("content_manage",addDetail.value.content_manage?"1":"0")
    data.append("score_manage",addDetail.value.score_manage?"1":"0")
    data.append("user_manage",addDetail.value.user_manage?"1":"0")
    data.append("super_admin",addDetail.value.super_admin?"1":"0")
    try{
        const result=await axios.post('/api/admin/admin',data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            ElMessage.success("成功！")
        }
        else{
            ElMessage.error(result.data.message)
        }
    }
    catch{
        ElMessage.error("后端连接失败！")
    }
    finally{
        showAdd.value=false
        getdata()
    }
}
async function set(){
  try{
    const result=await axios.get('/api/admin/setting',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
      setting.value=result.data.result
      showSet.value=true
    }
    else{
      ElMessage.error("提取数据失败！")
    }
  }
  catch{
    ElMessage.error("后端连接失败！")
  }
}
async function changeSet(){
  try{
    let data=new FormData()
    data.append("money_per_kg",String(setting.value.money_per_kg))
    data.append("rate",String(setting.value.rate))
    data.append("score",String(setting.value.score))
    const result=await axios.post('/api/admin/setting',data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
      ElMessage.success("上传成功！")
    }
    else{
      ElMessage.error("提取数据失败！")
    }
  }
  catch{
    ElMessage.error("后端连接失败！")
  }
  finally{
    showSet.value=false
  }
}
onMounted(()=>{getdata()})
</script>