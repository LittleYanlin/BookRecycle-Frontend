<template>
    <h2>本人订单</h2>
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
            v-show="!scope.row.isend"
            link
            type="primary"
            size="small"
            @click.prevent="complete(scope.row)"
          >
            完成订单
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
    <el-text type="primary">学生电话：</el-text><el-text>{{ userDetail.phone }}</el-text><br>
    <el-text type="primary">学生寝室地址：</el-text><el-text>{{ userDetail.address }}</el-text><br>
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
  <el-dialog v-model="completeVisible" title="完成订单" width="500">
    <el-form>
      <el-form-item label="实际重量" label-width="140px">
        <el-input-number v-model="kg" :precision="2" :step="0.1" :min="0">      
        <template #suffix>
        <span>kg</span>
      </template></el-input-number>
      </el-form-item>
      <el-form-item label="图片链接" label-width="140px">
        <el-input v-model="url" disabled/>
      </el-form-item>
      <el-button type="primary" @click="upload=true">上传图片</el-button>
      <el-image :src="url" fit="contain" style="width: 100%; height: auto;" v-show="url"/>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="completeVisible = false">取消</el-button>
        <el-button type="primary" @click="end_order()">
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
      <el-button size="small" type="primary" v-loading="uploading">点击上传</el-button>
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
import { onMounted, ref } from 'vue';
import {nanoid} from 'nanoid'
const uploading=ref(false)
const completeVisible=ref(false),kg=ref("0"),url=ref(''),id=ref('')
let bookData = ref<Array<any>>([])
const Loaded=ref(true)
const showDetail=ref(false),upload=ref(false)
const headers = ref({
  Authorization: 'Bearer ' + Cookies.get('access_token')
})
function complete(row:any){
    id.value=row.id
    completeVisible.value=true
}
async function end_order(){
    let Data=new FormData()
    Data.append("id",id.value)
    Data.append("kg_real",kg.value)
    Data.append("img_url",url.value)
    try{
        const result=await axios.post('/api/shoushu',Data,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}})
        if(result.data.status==1){
            ElMessage({
                message:"上传成功！获得余额"+result.data.money+'元',
                type:'success'
            })
        }
        else{
            ElMessage({
                message:result.data.message,
                type:'error'
            })
        }
    }
    catch{
        ElMessage({
                message:"后端请求失败！",
                type:'error'
            })
    }
    finally{
        completeVisible.value=false
        getdata()
    }
}
async function getdata(){
    try{
        Loaded.value=false
        const result=await axios.get('/api/get_user_upload_books',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),Action:"booker_check"}})
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
let userDetail = ref({
    phone:'',
    address:''
})
async function detail(row:any){
  bookDetail.value=row
  try{
    const result=await axios.get('/api/get_order_detail',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),id:row.id}})
    if(result.data.status==1){
        userDetail.value.address=result.data.result.address
        userDetail.value.phone=result.data.result.phone
        showDetail.value=true
    }
    else{
        ElMessage({
            message:"请求失败！",
            type:"error"
        })
    }
  }
  catch{
        ElMessage({
            message:"后端请求失败！",
            type:"error"
        })
    }
}
function handleSuccess(response:any, file:any, fileList:any) {
  uploading.value=false
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
    function beforeUpload(file:any) {
      if(uploading.value){
        ElMessage.error("正在上传中")
        return false
      }
      uploading.value=true
      const isValidFile = file.type === 'image/jpeg' || file.type === 'image/png';
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
  uploading.value=false
    ElMessage({
        message:'上传失败，请稍后重试',
        type:'error'
    })
}
onMounted(()=>{
    getdata()
})
</script>