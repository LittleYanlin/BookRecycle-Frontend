<template>
    <el-form label-width="auto" style="max-width: 600px">
      <el-form-item label="请输入大致重量(kg)">
        <el-input v-model="upload_kg" />
      </el-form-item>
      <el-form-item label="图片链接">
        <el-input v-model="url" disabled/>
      </el-form-item>
      <el-image :src="url" fit="contain" style="width: 100%; height: auto;" v-show="url"/>
      <el-form-item>
        <el-button type="primary" @click="upload=true">上传图片</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="upload" title="上传图片" width="500">
    <p>请注意：上传文件不能超过5MB</p>
    <el-upload
      class="upload-demo"
      action="/api/upload_img"
      :before-upload="beforeUpload"
      :headers="headers"
      :on-error="handleError"
      :on-success="handleSuccess"
      :show-file-list="false"
    >
      <el-button size="small" type="primary" v-loading="imageUploading">点击上传</el-button>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="upload = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { ref } from 'vue';
import {nanoid} from 'nanoid'
const imageUploading = ref(false)
const upload_kg=ref('')
const uploading=ref(false)
const headers = ref({
  Authorization: 'Bearer ' + Cookies.get('access_token')
})
const url=ref('')
  const upload=ref(false)
  function handleSuccess(response:any, file:any, fileList:any) {
    imageUploading.value = false
      if (response.status === 1) {
        ElMessage({
            message:'上传成功！',
            type:'success'
        })
        uploading.value=false
        url.value="/api"+response.url
      } else {
        ElMessage({
            message:response.message,
            type:'error'
        })
      }
      upload.value=false
    }
    function beforeUpload(file:any) {
      imageUploading.value = true
      uploading.value=true
      const isValidFile = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValidFile) {
        ElMessage({
            message:'图片格式不符合！',
            type:'error'
        })
        uploading.value=false
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
    uploading.value=false
}
async function onSubmit(){
  try{
  let Data=new FormData()
  Data.append("kg_upload",upload_kg.value)
  Data.append("img_url",url.value)
  const result=await axios.post('/api/upload_book',Data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
  if(result.data.status==1){
    ElMessage({
      message:"上传成功！",
      type:"success"
    })
    upload_kg.value=''
    url.value=''
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
      message:"上传失败！",
      type:"error"
    })
  }
}
</script>
<style>
.el-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-form-item__label {
  font-weight: 500;
  color: #333;
  padding: 0 10px;
}
.el-input__wrapper {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.el-image {
  background: #fff;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-button {
  margin: 0 10px 0 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.el-button--primary {
  background: #409eff;
  border: none;
  padding: 10px 20px;
}
.el-button--primary:hover {
  background: #3268b1;
}
.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #fff;
  font-size: 18px;
  font-weight: 500;
}
.el-dialog__body {
  padding: 20px;
  background: #fff;
}
.upload-demo {
  text-align: center;
  margin: 20px 0;
}
.el-upload {
  display: inline-block;
}
.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
.el-dialog--center .el-dialog__footer {
  text-align: center;
}
.el-dialog__footer button {
  margin: 0 10px;
}
@media (max-width: 480px) {
  .el-form {
    margin: 10px;
  }
  .el-button--primary {
    width: 100%;
  }
}
</style>