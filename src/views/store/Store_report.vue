<template>
    <h1>举报界面</h1>
    <el-form>
      <el-form-item label="被举报者学号">
        <el-input v-model="reportData.reported_user" autocomplete="off" />
      </el-form-item>
      <el-form-item label="请简要写举报内容">
        <el-input v-model="reportData.message" autocomplete="off" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="report()">提交</el-button>
</template>
<script lang="ts" setup>
import Cookies from 'js-cookie';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
let reportData=ref({
  reported_user:'',
  message:'',
  data:'',
})
let route=useRoute()
let router=useRouter()
reportData.value.reported_user=route.params.reported_user as string
reportData.value.data=route.params.data as string
async function report() {
    let Data=new FormData()
    Data.append("reported_user",reportData.value.reported_user)
    Data.append("message",reportData.value.message)
    Data.append("data",reportData.value.data)
    try{
        const result=await axios.post('/api/report',Data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            ElMessage({
                message:"举报提交成功！",
                type:"success"
            })
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
                message:"后端连接失败",
                type:"error"
            })
    }
}
</script>