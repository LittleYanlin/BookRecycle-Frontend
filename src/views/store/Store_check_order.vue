<template>
    <h2>本人订单</h2>
    <el-table :data="bookData" style="width: 100%" max-height="250" table-layout="auto" v-loading="!Loaded">
      <el-table-column prop="name" label="书名"/>
      <el-table-column prop="print_edition" label="书籍版本"/>
      <el-table-column prop="publisher" label="出版社"/>
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
          <el-button
            v-show="scope.row.available"
            link
            type="primary"
            size="small"
            @click.prevent="buy_end_dialog(scope.row.id)"
          >
            完成交易
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetail" title="详情" width="500">
    <el-text type="primary">编号：</el-text><el-text>{{ bookDetail.id }}</el-text><br>
    <el-text type="primary">书名：</el-text><el-text>{{ bookDetail.name }}</el-text><br>
    <el-text type="primary">版本：</el-text><el-text>{{ bookDetail.print_edition }}</el-text><br>
    <el-text type="primary">作者：</el-text><el-text>{{ bookDetail.publisher }}</el-text><br>
    <el-text type="primary">发布时间：</el-text><el-text>{{ bookDetail.time }}</el-text><br>
    <el-text type="primary">状态：</el-text><el-text>{{ bookDetail.available?"已上架":"已卖出" }}</el-text><br>
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
    v-model="buy_end_Visible"
    title="确定"
    width="500"
  >
    <span>确定完成交易吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="buy_end_Visible = false">取消</el-button>
        <el-button type="primary" @click="buy_end()">
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
const del_id=ref('')
let bookData = ref<Array<any>>([])
const Loaded=ref(true)
const showDetail=ref(false),buy_end_Visible=ref(false)
async function getdata(){
    try{
        Loaded.value=false
        const result=await axios.get('/api/get_uploaded_books',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),Action:"own"}})
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
  name:'',
  place:'',
  print_edition:'',
  publisher:'',
  time:'',
  uploader:''
})
function detail(row:any){
  bookDetail.value=row
  showDetail.value=true
}
function buy_end_dialog(id:any){
    del_id.value=id
    buy_end_Visible.value = true
}
async function buy_end(){
    try{
    const result=await axios.get('/api/book_end',{headers:{Authorization:"Bearer "+Cookies.get("access_token"),id:del_id.value}})
    if(result.data.status==1){
        ElMessage({
            message:"交易完成！",
            type:"success"
        })
        getdata()
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
            message:"删除失败！",
            type:"error"
        })
    }
    finally{
        buy_end_Visible.value = false
    }
}
onMounted(()=>{
    getdata()
})
</script>