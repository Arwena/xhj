<template>
  <div class="home">
    <topbar></topbar>
    <!-- <div style="display: flex;"> -->
	<el-container>
    	<sidebar></sidebar>
		<el-container >
			<!-- <el-header>
				<router-link to="/first">Home</router-link> |
				<router-link to="/about">About</router-link>
			</el-header> -->
			<router-view/>
		</el-container>
    </el-container>
	<!-- </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
	import topbar from '@/components/topbar.vue'
	import sidebar from '@/components/sidebar.vue'
	export default{
		name:'Home',
		components:{
			topbar,
			sidebar
		}
	}
</script>
