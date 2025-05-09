<template>
    <h2>查看举报</h2>
    <el-table :data="reportData" style="width: 100%" max-height="250" table-layout="auto" v-loading="loading">
      <el-table-column prop="reported_user" label="被举报学号"/>
      <el-table-column prop="time" label="举报提交时间"/>
      <el-table-column prop="data" label="举报内容id"/>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="detail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-show="scope.row.available"
            link
            type="primary"
            size="small"
            @click.prevent="del(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="详情" width="500">
    <el-text type="primary">举报内容：</el-text><el-text>{{ reportDetail.message }}</el-text><br>
    <el-text type="primary">状态：</el-text><el-text>{{ reportDetail.available?"已提交":"已解决" }}</el-text><br>
    <el-text type="primary" v-show="!reportDetail.available">扣分：</el-text><el-text>{{ reportDetail.score }}</el-text><br>
  </el-dialog>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
const showDetail=ref(false)
const loading=ref(false)
let reportData = ref<Array<any>>([])
let reportDetail = ref({
  available:'',
  score:'',
  message:'',
  time:''
})
import Cookies from 'js-cookie';
async function getdata() {
  loading.value=true
    try{
    const result=await axios.get('/api/store/report',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
        reportData.value=result.data.result
    }
    else{
        ElMessage({
            message:"获取信息失败",
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
    finally{
      loading.value=false
    }
}
function detail(row:any){
reportDetail.value=row
  showDetail.value=true
}
async function del(row:any) {
    try {
    const response = await axios.delete('/api/official/report',{headers:{id:row.id,Authorization:"Bearer "+Cookies.get("access_token")}});
    if (response.data.status === 1) {
      ElMessage.success('删除成功');
      getdata()
    } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
onMounted(()=>{getdata()})
</script>