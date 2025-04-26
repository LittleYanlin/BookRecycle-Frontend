<template>
    <div>
      <el-button @click="router.push('/message')">返回</el-button>
      <el-button @click="fetchData()">刷新</el-button>
      <el-card class="chat-container" v-loading="loading">
        <h2>聊天记录详情--{{ route.params.req_user }}</h2>
        <div v-if="status === 1">
          <el-scrollbar height="400px">
            <el-timeline>
              <el-timeline-item
                v-for="(chat, index) in chats"
                :key="index"
                :timestamp="chat.time"
                placement="top"
              >
                <el-card shadow="hover">
                  <p><strong>{{ chat.poster==username?'你':chat.poster }}</strong>:</p>
                  <p>
                    {{ chat.data }}
                  </p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </div>
        <div v-else>
          <el-alert :title="message" type="error" show-icon></el-alert>
        </div>
        <el-input v-model="messageInput" style="width: 290px" placeholder="请输入发送的信息" />
        <el-button type="primary" @click="postData">发送</el-button>
      </el-card>
    </div>
  </template>
<script lang="ts" setup>
import { ref, onMounted,onUpdated } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
const username = Cookies.get('username') || '';
const chats = ref<any[]>([]);
const status = ref(0);
const message = ref('');
const messageInput = ref('');
const receiver = ref('');
const loading=ref(false)
import { useRoute, useRouter } from 'vue-router';
let route=useRoute()
const router=useRouter()
async function fetchData() {
  try {
    loading.value=true
    const postData = new FormData();
    postData.append('req_user',route.params.req_user as string)
    const response = await axios.post('/api/chat/get/detail', postData,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}});
    if (response.data.status === 1) {
      chats.value = response.data.data;
      status.value = 1;
    } else {
      status.value = 0;
      message.value = response.data.message;
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    status.value = 0;
    message.value = '请求失败，请检查网络或服务器错误';
    ElMessage.error('请求失败，请检查网络或服务器错误');
  }
  finally{
    ElMessage.info("数据加载完成")
    loading.value=false
  }
}
onMounted(async () => {
  await fetchData()
})
async function postData() {
    receiver.value=route.params.req_user as string
  if (!receiver.value.trim() || !messageInput.value.trim()) {
    ElMessage.warning('接收者和消息内容不能为空');
    return;
  }

  try {
    const postData = new FormData();
    postData.append('receiver', receiver.value);
    postData.append('data', messageInput.value);

    const response = await axios.post('/api/chat/post', postData,{headers:{Authorization:"Bearer "+Cookies.get("access_token")}});

    if (response.data.status === 1) {
      ElMessage.success('消息发送成功！');
      messageInput.value = ''; // 发送成功后清空输入框
      fetchData(); // 重新获取聊天记录
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('发送失败，请检查网络或服务器错误');
  }
}
</script>
<style scoped>
.chat-container {
  margin: 20px auto;
  padding: 20px;
}
.time {
  font-size: 0.8em;
  color: gray;
}
.chat-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>