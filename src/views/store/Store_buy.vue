<template>
  <h2>市场</h2>
  <el-button @click="getdata()">
        刷新
    </el-button>
  <div>
    <el-button class="mt-4" style="width: 100%" @click="onAddItem=true">
        上传旧书信息
    </el-button>
    <el-table :data="bookData" style="width: 100%" max-height="250" table-layout="auto" v-loading="!Loaded">
      <el-table-column prop="name" label="书名"/>
      <el-table-column prop="print_edition" label="书籍版本"/>
      <el-table-column prop="publisher" label="出版社"/>
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
            @click.prevent="buy(scope.row)"
          >
            联系书主
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="report(scope.row)"
          >
            举报
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="onAddItem" title="添加项目" width="500">
    <el-form>
      <el-form-item label="书名" label-width="150px">
        <el-input v-model="name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="版本" label-width="150px">
        <el-input v-model="print_edition" autocomplete="off" />
      </el-form-item>
      <el-form-item label="出版社" label-width="150px">
        <el-input v-model="publisher" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片链接" label-width="150px">
        <el-input v-model="url" autocomplete="off" disabled/>
      </el-form-item>
    </el-form>
    <div class="upload-btn-container">
    <el-button type="primary" @click="upload=true">
      上传图片<el-icon><Upload /></el-icon>
        </el-button>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onAddItem = false">关闭</el-button>
        <el-button type="primary" @click="uploadBook">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="upload" title="上传图片" width="500">
    <p>请注意：上传文件不能超过5MB</p>
    <el-upload
      class="upload-demo"
      action="/api/upload_img"
      :before-upload="beforeUpload"
      :on-error="handleError"
      :on-success="handleSuccess"
      :show-file-list="false"
      :headers="headers"
    >
      <el-button size="small" type="primary" v-loading="imageUploading">点击上传</el-button>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="upload = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="showDetail" title="详情" width="500" class="upload">
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
  </div>
  </template>
<script lang="ts" setup>
import axios from 'axios';
import { ElMessage,ElLoading } from 'element-plus';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import {nanoid} from 'nanoid'
import { useRouter } from 'vue-router';
const postData=new FormData()
const Loaded=ref(false),uploading=ref(false)
const imageUploading = ref(false)
const headers = ref({
  Authorization: 'Bearer ' + Cookies.get('access_token')
})
const route=useRouter()
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
function report(row:any){
  route.push({
    name:'store_report',
    params:{
      reported_user:row.uploader,
      data:row.id
    }
  })
}
const onAddItem=ref(false),upload=ref(false),showDetail=ref(false)
const name=ref(),print_edition=ref(),publisher=ref(),url=ref('')
let bookData = ref<Array<any>>([])
async function getdata(){
    try{
      Loaded.value=false
        const result=await axios.get('/api/get_uploaded_books',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),Action:"all"}})
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
function beforeUpload(file:any) {
      const isValidFile = file.type === 'image/jpeg' || file.type === 'image/png';
      imageUploading.value = true
      if (!isValidFile) {
        ElMessage({
            message:'图片格式不符合！',
            type:'error'
        })
        return false
      }
      const fileExtension = file.name.split('.').pop()
      const newFileName = nanoid()+'.'+fileExtension
      let newFile = new File([file], newFileName)
      console.log(file.name)
      return newFile
    }
function handleError(){
  imageUploading.value = false
    ElMessage({
        message:'上传失败，请稍后重试',
        type:'error'
    })
}
async function uploadBook(){
  if(uploading.value){
    ElMessage({
      message:"上传中，请勿重复点击！",
      type:"error"
    })
    return
  }
  let uploadBookData=new FormData()
  uploadBookData.append('name',name.value)
  uploadBookData.append('print_edition',print_edition.value)
  uploadBookData.append('publisher',publisher.value)
  uploadBookData.append('img_url',url.value)
  uploading.value=true
  try{
    let result=await axios.post('/api/upload_book_hub',uploadBookData,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
      ElMessage({
        message:"上传成功！",
        type:'success'
      })
    }
    else{
      ElMessage({
        message:result.data.message,
        type:'error'
      })
    }
    uploading.value=false
    getdata()
  }
  catch(error){
    ElMessage({
      message:'上传失败，请稍后再试！',
      type:"error"
    })
    uploading.value=false
  }
  onAddItem.value=false
}
function handleSuccess(response:any, file:any, fileList:any) {
  imageUploading.value = false
      if (response.status === 1) {
        ElMessage({
            message:'上传成功！',
            type:'success'
        })
        url.value="/api"+response.url
      } else {
        ElMessage({
            message:response.message,
            type:'error'
        })
      }
      upload.value=false
    }
onMounted(()=>{
    getdata()
})
function detail(row:any){
  bookDetail.value=row
  showDetail.value=true
}
function buy(row:any){
  route.push({
    name:'chat_detail',
    params:{req_user:row.uploader}
  })
}
</script>
<style scoped>
.upload-btn-container{
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>