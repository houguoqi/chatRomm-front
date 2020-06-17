import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes=[
    {
        path:'',
        redirect: '/login'
    },
    {
        path:'/login',
        component:()=>import('../components/Login.vue')
    },
    {
        path:'/chat',
        component:()=>import('../components/Chat.vue')
    }
]

const router=new VueRouter({
    routes
})
export default router