<template>
	<div class="sidebar">
		<el-aside >
			<el-scrollbar style="height: 100%; width: 100%;">
				<el-menu background-color="#001c47" text-color="#8a979e"  default-active="home"  @open="handleOpen" @close="handleClose">
					<el-menu-item index="home" @click="$router.push({ name: 'First' })">
						<i class="el-icon-s-home"></i>
						<span slot="title">首页</span>
					 </el-menu-item>
					 <sidebar-item v-for="(item,index) in navlist" :item="item" ></sidebar-item>
					 <!-- <el-submenu v-for="(item) in navlist" index="item.menuId">
						 <template slot="title">
						   <i class="el-icon-setting"></i>
						   <span>{{item.menuName}}</span>
						 </template>
						 <el-menu-item v-for="child in item.children">
							 <span>{{child.menuName}}</span>
						 </el-menu-item>
					 </el-submenu> -->
				</el-menu>
			</el-scrollbar>
		</el-aside>
	</div>
</template>

<script>
	import SidebarItem from '@/components/sidebaritem'
	export default{
		name:'sidebar',
		components:{SidebarItem},
		props:{
			
		},
		data(){
			return{
				navlist:[]
			}
		},
		mounted(){
			this.getNavlist()
		},
		methods:{
			getNavlist(){
				this.$http({
					url:'/menu/routing',
				}).then(res=>{
					// console.log(res)
					this.navlist = res
				})
			},
			handleOpen(key,keypath){
				// console.log(key,keypath)
			},
			handleClose(key,keypath){
				// console.log(key,keypath)
			}
		}
	}
</script>

<style lang="less">
	.sidebar{
		width: 11%;
		min-width: 180px;
		height: 900px;
		background-color: #001c47;
		.el-aside{
			width: 100%!important;
			text-align: left;
			.el-menu-item,.el-submenu{
				width: 100%;
				margin: 0 1px;
			}
			li.is-active{
				background-color: #001029;
			}
		}
	}
</style>
