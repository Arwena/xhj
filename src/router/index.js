import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'login',
	redirect:{
		name:'Login'
	}
    // component: Home
  },
  {
		path:'/login',
		name:'Login',
		component:() => import('@/views/login.vue'),
  },
  {
		path:'/home',
		name:'Home',
		component:() => import('@/views/Home.vue'),
		redirect:{
			name:'First'
		},
		children:[
			// {
			//   path: '/about',
			//   name: 'About',
			//   // route level code-splitting
			//   // this generates a separate chunk (about.[hash].js) for this route
			//   // which is lazy-loaded when the route is visited.
			//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
			// },
			{
			  path:'/first',
			  name:'First',
			  component: () => import(/* webpackChunkName: "first" */ '../views/first.vue')
			}
		]
  },
  {
	path:"/sys",
	name:'System',
	component:() => import('@/views/Home.vue'),
	redirect:{
		name:'User'
	},
	children:[
		{
			path:'/sys/user',
			name:'User',
			component:() =>import(/* webpackChunkName: "user" */ '../views/system/usermanage.vue')
		},
		{
			path:'/sys/role',
			name:'Role',
			component:() =>import(/* webpackChunkName: "role" */ '../views/system/rolemanage.vue')
		},
		{
			path:'/sys/zone',
			name:'Zone',
			component:()=>import('../views/system/zonemanage.vue')
		},
		{
			path:'/sys/dictionary',
			name:'Dictionary',
			component:()=>import('../views/system/dictionary.vue')
		},
		{
			path:'/sys/config',
			name:'Config',
			component:() => import('../views/system/config.vue')
		},
		{
			path:'/sys/log',
			name:'Log',
			component:() => import('../views/system/log.vue')
		}
	]
  },
  {
	  path:"/road",
	  name:'Road',
	  component:()=> import('@/views/Home.vue'),
	  redirect:{
		  name:'roadList'
	  },
	  children:[
		  {
			  path:'/road/list',
			  name:'roadList',
			  component:() => import('@/views/basics/roadmanage/list.vue')
		  },
		  {
			  path:'road/setting',
			  name:'rSetting',
			  component:() => import('@/views/basics/roadmanage/roadsetting.vue'),
			  redirect:{
				name:'crosSeting'
			  },
			  children:[
				  {
				  			 path:'/road/croseting',
				  			 name:'crosSeting',
				  			 component:() => import('@/views/basics/roadmanage/croseting.vue')
				  },
				  {
				  			  path:'/road/laneseting',
				  			  name:'laneSeting',
				  			  component:()=> import('@/views/basics/roadmanage/laneseting.vue')
				  }
			  ]
		  }
		  
	  ]    
  }
]
//相同路径跳转报错
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return routerPush.call(this, location, onResolve, onReject)
    return routerPush.call(this, location).catch(error => error)
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior:() =>{
	  y:0
  }
})

export default router
