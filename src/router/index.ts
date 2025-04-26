import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Reg from '@/views/Reg.vue'
import Official_index from '@/views/official/Official_index.vue'
import Official_upload from '@/views/official/Official_upload.vue'
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus'
import Store_index from '@/views/store/Store_index.vue'
import Store_buy from '@/views/store/Store_buy.vue'
import Chat_index from '@/views/chat/Chat_index.vue'
import Chat_detail from '@/views/chat/Chat_detail.vue'
import Store_check_order from '@/views/store/Store_check_order.vue'
import Official_check_order from '@/views/official/Official_check_order.vue'
import Booker_index from '@/views/booker/Booker_index.vue'
import Booker_get_order from '@/views/booker/Booker_get_order.vue'
import Booker_check_order from '@/views/booker/Booker_check_order.vue'
import User from '@/views/User.vue'
import Admin_index from '@/views/admin/Admin_index.vue'
import Admin_user from '@/views/admin/Admin_user.vue'
import Admin_score from '@/views/admin/Admin_score.vue'
import Store_report from '@/views/store/Store_report.vue'
import Store_check_report from '@/views/store/Store_check_report.vue'
import axios from 'axios'
async function refresh(){
  try{
  const header={Authorization:"Bearer "+Cookies.get("refresh_token")}
  const result=await axios.post('/api/refresh',{},{headers:header})
  if (result.status!=200){
    return 0
  }
  Cookies.set("access_token",result.data.access_token)
  return 1
}
catch{
  return 0
}
}
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue'
import Admin_content from '@/views/admin/Admin_content.vue'
import Admin_admin from '@/views/admin/Admin_admin.vue'
const token = Cookies.get("access_token")
const role=ref(Cookies.get("role"))
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '主页' },
      beforeEnter: async (to, from, next) => {
        const isAuthenticated = !!Cookies.get('access_token')
        console.log('!!'+isAuthenticated)
        if (isAuthenticated) {
          next()
          } 
        else {
          const code=refresh()
          if(await code==1){
            next()
          }
          else{
            ElMessage({
              message:'请先登录！',
              type:'info'
            })
            next('/login')
        }
      }
      },
      children:[
        {
          path:'official',
          name:'official',
          component:Official_index,
          meta: { title: '旧书回收' },
          children:[{
            path:'upload',
            name:'official_upload',
            component:Official_upload,
            meta: { title: '上传' },
          },
          {
            path:'check_order',
            name:'official_check_order',
            meta: { title: '查看订单' },
            component:Official_check_order
          }
        ]
        },
        {
          path:'store',
          name:'store',
          meta: { title: '旧书再利用' },
          component:Store_index,
          children:[
            {
              path:'buy',
              name:'store_buy',
              meta: { title: '购买' },
              component:Store_buy
            },
            {
              path:'check_order',
              name:'store_check_order',
              meta: { title: '查看订单' },
              component:Store_check_order
            },
            {
              path:'report/:reported_user/:data',
              name:'store_report',
              meta: { title: '举报' },
              component:Store_report
            },
            {
              path:'check_report',
              name:"check_report",
              meta: { title: '查看举报' },
              component:Store_check_report
            }
          ]
        },
        {
          path:'message',
          name:'message_index',
          component:Chat_index,
          meta: { title: '聊天' },
        },
        {
          path:"detail/:req_user",
          name:"chat_detail",
          meta: { title: '聊天详情' },
          component:Chat_detail
        },
        {
          path:'/booker',
          name:'booker',
          meta: { title: '收书员' },
          component:Booker_index,
          children:[
            {
              path:'get_order',
              name:'Booker_get_order',
              meta: { title: '获得订单' },
              component:Booker_get_order
            },
            {
              path:'check_order',
              meta: { title: '查看订单' },
              name:'Booker_check_order',
              component:Booker_check_order
            }
          ]
        },
        {
          path:'/user',
          name:'user',
          meta: { title: '个人信息维护' },
          component:User
        },
        {
          path:'/admin',
          name:'admin_index',
          meta: { title: '管理员' },
          component:Admin_index,
          children:[
            {
              path:'user',
              name:'Admin_user',
              meta: { title: '用户' },
              component:Admin_user
            },
            {
              path:'score',
              meta: { title: '信誉分' },
              name:'Admin_score',
              component:Admin_score
            },
            {
              path:'content',
              name:'Admin_content',
              meta:{titie:'内容'},
              component:Admin_content
            },
            {
              path:'admin',
              name:'Admin_admin',
              meta:{title:'管理员'},
              component:Admin_admin
            }
          ]
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login,
    },
    {
      path:'/reg',
      name:'reg',
      component:Reg,
    }
  ],
})
export default router
