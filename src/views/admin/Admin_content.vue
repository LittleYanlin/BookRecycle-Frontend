<template>
    <el-table :data="bookData" style="width: 100%" max-height="250" table-layout="auto" v-loading="!Loaded">
      <el-table-column prop="name" label="书名"/>
      <el-table-column prop="print_edition" label="书籍版本"/>
      <el-table-column prop="publisher" label="出版社"/>
      <el-table-column prop="uploader" label="上传者"/>
      <el-table-column prop="place" label="校区" :formatter="formatPlace"/>
      <el-table-column prop="available" label="状态" :formatter="availableFormat"/>
      <el-table-column label="操作" width="300">
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
            @click.prevent="ban(scope.row)"
          >
            封禁/解封
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="详情" width="500" class="upload" style="width: 80%;">
    <el-text type="primary">编号：</el-text><el-text>{{ bookDetail.id }}</el-text><br>
    <el-text type="primary">书名：</el-text><el-text>{{ bookDetail.name }}</el-text><br>
    <el-text type="primary">版本：</el-text><el-text>{{ bookDetail.print_edition }}</el-text><br>
    <el-text type="primary">作者：</el-text><el-text>{{ bookDetail.publisher }}</el-text><br>
    <el-text type="primary">发布时间：</el-text><el-text>{{ bookDetail.time }}</el-text><br>
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
  <el-dialog
    v-model="banVisible"
    title="确认"
    width="500"
  >
    <span>你确定要{{ banText }}吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="banVisible = false">取消</el-button>
        <el-button type="primary" @click="banConfirm()">
          确认
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
import { useRouter } from 'vue-router';
const Loaded=ref(false),showDetail=ref(false),banVisible=ref(false)
const banId=ref(''),banText=ref('')
function formatPlace(row:any) {
    switch (row.place) {
      case 1:
        return '朝晖';
      case 2:
        return '屏峰';
      default:
        return '莫干山';
    }
}
function ban(row:any){
    banId.value=row.id
    banText.value=row.available?"封禁":"解封"
    banVisible.value=true
}
async function banConfirm(){
    const headers = {
  Authorization: 'Bearer ' + Cookies.get('access_token'),
  id:banId.value
    }
    try{
        const result=await axios.delete('/api/admin/bookManage',{headers:headers})
        if(result.data.status==1){
            ElMessage.success(result.data.message)
        }
        else{
            ElMessage.error(result.data.message)
        }
    }
    catch(error){
        ElMessage.error("操作失败！")
    }
    finally{
        getdata()
        banVisible.value=false
    }
}
function availableFormat(row:any){
    if(row.available){
        return '已上架'
    }
    else{
        return '未上架或已完成交易'
    }
}
let bookDetail = ref({
  available:'',
  id:'',
  img_url:'',
  name:'',
  place:'',
  print_edition:'',
  publisher:'',
  time:'',
  uploader:''
})
let bookData = ref<Array<any>>([])
async function getdata(){
    try{
      Loaded.value=false
        const result=await axios.get('/api/admin/bookManage',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
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
    finally{
        Loaded.value=true
    }
}
onMounted(()=>{
    getdata()
})
function detail(row:any){
  bookDetail.value=row
  showDetail.value=true
}
</script>