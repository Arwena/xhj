<template>
	<div class="noth">
		<el-steps :active="active" finish-status="success" simple="">
			<el-step title="路口配置" @click.native="cross"></el-step>
			<el-step title="车道配置" @click.native="lane"></el-step>
			<el-step title="通道配置"></el-step>
			<el-step title="绿冲突定义"></el-step>
			<el-step title="周期方案"></el-step>
			<el-step title="调度管理"></el-step>
		</el-steps>
		<div><router-view/></div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				active:0
			}
		},
		methods:{
			cross(){
				this.$router.push({name:'crosSeting'})
			},
			lane(){
				console.log('lane')
			}
		}
	}
</script>

<style>
</style>
