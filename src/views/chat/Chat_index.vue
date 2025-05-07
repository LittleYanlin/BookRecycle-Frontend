<template>
<div class="index">
  <div class="chat-container">
    <el-card>
      <h2>聊天记录</h2>
      <div v-if="status === 1" class="chat-container">
        <el-scrollbar class="chat-scrollbar">
          <el-timeline>
            <el-timeline-item
              v-for="(chat, index) in chats"
              :key="index"
              placement="top"
            >
              <el-card shadow="hover" @click="router.push({
                name:'chat_detail',
                params:{req_user:chat.poster}
              })">
                <p><strong>{{ chat.poster }}</strong>:</p>
                <p v-for="(msg, i) in chat.data" :key="i">
                  {{ msg }} <span class="time">{{ chat.time[i] }}</span>
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
      <div v-else>
        <el-alert :title="message" type="error" show-icon></el-alert>
      </div>
    </el-card>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
const chats = ref<any[]>([]);
const status = ref(0);
const message = ref('');
const router=useRouter()
async function fetchData() {
  try {
    const response = await axios.get('/api/chat/get/all',{headers:{Authorization:"Bearer "+Cookies.get("access_token")}});
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
}
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 10px;
  gap: 4px;
  height: auto;
}

.time {
  font-size: 0.8em;
  color: #666;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #ff4757;
}

#chat-container {
  background-color: #f5f6fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

#chat-container h2 {
  margin-bottom: 15px;
}

#timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#timeline-item {
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
}

#timeline-item strong {
  font-size: 0.9em;
  color: #666;
}

#message {
  background-color: #f1f5f9;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  color: #333;
}

#message p {
  margin-bottom: 5px;
}

#message p:last-child {
  margin-bottom: 0;
}

.error {
  color: #dc3545;
}
</style>