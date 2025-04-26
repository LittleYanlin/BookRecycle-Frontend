<template>
    <h2>订单大厅</h2>
    <el-skeleton :rows="5" animated v-show="!Loaded"/>
    <el-table :data="bookData" style="width: 100%" max-height="250" table-layout="auto" v-show="Loaded">
      <el-table-column prop="time" label="上传时间"/>
      <el-table-column prop="kg_upload" label="大概重量"/>
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
            link
            type="primary"
            size="small"
            @click.prevent="get_order(scope.row.id)"
          >
            接单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="详情" width="500">
    <el-text type="primary">编号：</el-text><el-text>{{ bookDetail.id }}</el-text><br>
    <el-text type="primary">发布时间：</el-text><el-text>{{ bookDetail.time }}</el-text><br>
    <el-text type="primary">大概重量（kg）：</el-text><el-text>{{ bookDetail.kg_upload }}</el-text><br>
    <div v-show="bookDetail.isend">
    <el-text type="primary">学生获得奖励：</el-text><el-text>{{ bookDetail.money_uploader }}</el-text><br>
    <el-text type="primary">收书员获得奖励：</el-text><el-text>{{ bookDetail.money_booker }}</el-text><br>
    </div>
    <el-text type="primary">状态：</el-text><el-text>{{ bookDetail.available?"已上架，等待收书员接单":bookDetail.isend?"交易完成":"收书员已接单，等待收书"}}</el-text><br>
    <el-text type="primary">照片：</el-text>
    <el-image :src="bookDetail.img_url" fit="contain" style="width: 100%; height: auto;" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDetail = false">关闭</el-button>
        <el-button type="primary" @click="showDetail = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
let bookData = ref<Array<any>>([])
const Loaded=ref(true)
const showDetail=ref(false)
async function getdata(){
    try{
        const postData=new FormData()
        postData.append("action","all")
        Loaded.value=false
        const result=await axios.post('/api/get_user_upload_books',postData,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            bookData.value=result.data.result
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
}
let bookDetail = ref({
  available:'',
  id:'',
  img_url:'',
  money_uploader:'',
  money_booker:'',
  isend:'',
  kg_upload:'',
  time:'',
  uploader:''
})
function detail(row:any){
  bookDetail.value=row
  showDetail.value=true
}
function get_order(id:any){
    ElMessageBox.confirm(
    '你确认要这单吗？',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(()=>{get_order_confirm(id)})
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}
async function get_order_confirm(id:any){
    try{
    let Data=new FormData
    Data.append("id",id)
    const result=await axios.post('/api/get_order',Data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
        ElMessage({
            message:result.data.message,
            type:"success"
        })
    }
    else{
        ElMessage({
            message:result.data.message,
            type:"success"
        })
    }
    }
    catch{
        ElMessage({
            message:"后端连接失败",
            type:"success"
        })  
    }
    finally{
        getdata()
    }
}
onMounted(()=>{
    getdata()
})
</script>