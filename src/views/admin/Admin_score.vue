<template>
  <div>
    <el-button v-if="authorized" @click="showReasonDialog" type="primary">管理理由库</el-button>
    <el-divider></el-divider>
    <el-table :data="studentsData" v-if="authorized" style="width: 100%" v-loading="loading">
      <el-table-column prop="report_user" label="举报者学号"></el-table-column>
      <el-table-column prop="reported_user" label="被举报者学号"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="detail(row)">详情</el-button>
          <el-button @click="openScoreManage(row)">管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 扣分理由选择对话框 -->
    <el-dialog v-model="scoreDialogVisible" title="修改信誉分" style="width: 80%;">
      <el-form :model="scoreForm" label-width="80px">
        <el-form-item label="选择理由">
          <el-select v-model="scoreForm.reason" placeholder="请选择理由" :disabled="!scoreForm.available">
            <el-option
              v-for="reason in reasonList"
              :key="reason.id"
              :label="reason.reason"
              :value="reason.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扣分">
          <el-input-number v-model="scoreForm.score" :min="0" :max="100" :disabled="!scoreForm.available"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scoreDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitScore" v-show="scoreForm.available">确认</el-button>
        <el-button type="primary" @click="cancelScore" v-show="!scoreForm.available">取消本次扣分</el-button>
      </span>
    </el-dialog>
    <!-- 理由库管理对话框 -->
    <el-dialog v-model="reasonDialogVisible" title="管理理由库" style="width: 80%;">
      <el-input v-model="newReason" placeholder="请输入新的理由"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reasonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addReason">添加</el-button>
      </span>
      <el-divider></el-divider>
      <el-table :data="reasonList" style="width: 100%">
        <el-table-column prop="reason" label="理由"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button @click="deleteReason(row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="showDetail" title="详情" width="500" style="width: 80%;">
    <el-text type="primary">状态：</el-text><el-text>{{ bookDetail.available?"等待处理":"已处理" }}</el-text><br>
    <el-text type="primary">举报理由：</el-text><el-text>{{ bookDetail.message }}</el-text><br>
    <el-text type="primary">编号：</el-text><el-text>{{ bookDetail.id }}</el-text><br>
    <el-text type="primary">上传者：</el-text><el-text>{{ bookDetail.uploader }}</el-text><br>
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
import { onMounted, ref } from 'vue';
import { ElMessage, ElButton, ElDivider, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption } from 'element-plus';
import axios from 'axios';
import Cookies from 'js-cookie';
const studentsData = ref([]);
const authorized = ref(false);
const scoreDialogVisible = ref(false);
const reasonDialogVisible = ref(false),showDetail=ref(false)
const scoreForm = ref({ reason: '', score: 0, username: '' ,id:'',available:true});
const reasonList = ref([]);
const newReason = ref('');
const headerData={Authorization:"Bearer "+Cookies.get("access_token")}
const loading=ref(false)
let bookDetail = ref({
  available:'',
  id:'',
  img_url:'',
  name:'',
  place:'',
  print_edition:'',
  publisher:'',
  time:'',
  uploader:'',
  message:''
})
onMounted(() => { getdata() });
async function cancelScore() {
  try {
    const formData = new FormData();
    formData.append('id', scoreForm.value.id);
    const response = await axios.post('/api/admin/score_cancel',formData,{headers:headerData})
    if (response.data.status === 1) {
      ElMessage.success('分数修改成功');
      scoreDialogVisible.value = false;
      fetchStudentsData();
    } else {
      ElMessage.error('成绩修改失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
async function detail(row:any){
  let id=row.data
  try{
    const result=await axios.get('/api/admin/book_manage',{headers:{id:id,Authorization:"Bearer "+Cookies.get("access_token")}})
    if(result.data.status==1){
      bookDetail.value=result.data.result
      bookDetail.value.message=row.message
      bookDetail.value.available=row.available
      showDetail.value=true
    }
  }
  catch{
    ElMessage.error("后端连接失败")
  }
}
async function getdata(){
  try {
    loading.value=true
    const response = await axios.post('/api/admin/score',{},{headers:headerData});
    if (response.data.status === 1) {
      authorized.value = true;
      fetchStudentsData();
      fetchReasonList();
    } else {
      ElMessage.error('用户名或密码错误，或您没有权限');
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试');
  }
  finally{
    loading.value=false
  }
}
async function fetchStudentsData(){
  try {
    const response = await axios.post('/api/admin/score',{},{headers:headerData});
    if (response.data.status === 1) {
      studentsData.value = response.data.data;
    } else {
      ElMessage.error('获取学生数据失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
async function fetchReasonList(){
  try {
    const response = await axios.get('/api/admin/reason',{
      headers:headerData
    });
    if (response.data.status === 1) {
      reasonList.value = response.data.data;
    }
  } catch (error) {
    ElMessage.error('加载理由失败');
  }
}
function openScoreManage(student: any){
  scoreForm.value.username = student.reported_user;
  scoreForm.value.id=student.id,
  scoreForm.value.available=student.available
  scoreForm.value.score=student.score||0
  scoreDialogVisible.value = true;
}

async function submitScore(){
  try {
    const formData = new FormData();
    formData.append('stu_username', scoreForm.value.username);
    formData.append('score', scoreForm.value.score.toString());
    formData.append('reason', scoreForm.value.reason);
    formData.append('id', scoreForm.value.id);
    const response = await axios.post('/api/admin/score_manage', formData,{headers:headerData})
    if (response.data.status === 1) {
      ElMessage.success('分数修改成功');
      scoreDialogVisible.value = false;
      fetchStudentsData();
    } else {
      ElMessage.error('成绩修改失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
function showReasonDialog(){
  reasonDialogVisible.value = true;
  fetchReasonList()
}
async function addReason(){
  try {
    const Data=new FormData()
    Data.append("reason",newReason.value)
    const response = await axios.post('/api/admin/reason',Data,{headers:headerData});
    if (response.data.status === 1) {
      ElMessage.success('理由添加成功');
      reasonDialogVisible.value = false;
      fetchReasonList();
    } else {
      ElMessage.error('添加失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
async function deleteReason(row: any){
  try {
    const Data=new FormData()
    const header={Authorization:"Bearer "+Cookies.get("access_token"),id:row.id}
    Data.append("id",row.id)
    const response = await axios.delete('/api/admin/reason',{headers:header});
    if (response.data.status === 1) {
      ElMessage.success('理由删除成功');
      fetchReasonList();
    } else {
      ElMessage.error('删除失败');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
</script>
