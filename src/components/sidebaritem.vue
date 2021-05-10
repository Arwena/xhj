<template>
	<div v-if="item.available">
		<template v-if="item.children ==null">
			<!-- <router-link :to="item.path"> -->
				<!-- <el-menu-item :index="item.menuId.toString()"> -->
				<el-menu-item :index="item.path">
					<i v-if="item.icon!=''" :class="item.icon"></i>
					<span>{{item.menuName}}</span>
				</el-menu-item>
			<!-- </router-link> -->
		</template>
		<el-submenu v-else :index="item.menuId.toString()">
		<!-- <el-submenu v-else :index="item.path"> -->
			<template slot="title">
				<i v-if="item.icon!=''" :class="item.icon"></i>
				<span>{{item.menuName}}</span>
			</template>
			<sidebar-item v-for="child in item.children" :item="child"></sidebar-item>
		</el-submenu>
	</div>
</template>

<script>
	export default {
		name: 'SidebarItem',
		props:{
			item:{
				type:Object,
				required:true
			}
		},
		methods:{
		}
	}
</script>

<style>
</style>
