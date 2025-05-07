<template>
    <h2>本人订单</h2>
    <el-table :data="bookData" style="width: 100%" max-height="250" table-layout="auto" v-loading="!Loaded">
      <el-table-column prop="time" label="上传时间"/>
      <el-table-column prop="kg_upload" label="大概重量"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="detail(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="详情" width="500">
    <el-text type="primary">编号：</el-text><el-text>{{ bookDetail.id }}</el-text><br>
    <el-text type="primary">发布时间：</el-text><el-text>{{ bookDetail.time }}</el-text><br>
    <div v-show="bookDetail.isend">
    <el-text type="primary">学生获得奖励：</el-text><el-text>{{ bookDetail.money_uploader }}元</el-text><br>
    <el-text type="primary">收书员获得奖励：</el-text><el-text>{{ bookDetail.money_booker }}元</el-text><br>
    <el-text type="primary">实际重量：</el-text><el-text>{{ bookDetail.kg_real }}KG</el-text><br>
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
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
let bookData = ref<Array<any>>([])
const Loaded=ref(true)
const showDetail=ref(false)
async function getdata(){
    try{
        const postData=new FormData()
        Loaded.value=false
        const result=await axios.get('/api/get_user_upload_books',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),Action:"stu_check"}})
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
  publisher:'',
  time:'',
  uploader:'',
  kg_real:''
})
function detail(row:any){
  bookDetail.value=row
  showDetail.value=true
}
onMounted(()=>{
    getdata()
})
</script>