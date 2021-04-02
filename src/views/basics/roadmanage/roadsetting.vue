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
		<div class="topbtn">
			<el-button type="primary" round plain @click="tonext">下一步</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				active:0,
				stepSeted:[],
				crossId:''
			}
		},
		mounted(){
			this.crossId = this.$route.params.crossId
			this.$http({
				url:'/cross/configMap',
				param:{
					crossId:this.crossId
				}
			}).then(res=>{
				console.log(res)
			})
		},
		methods:{
			tonext(){
				this.active++
			},
			cross(){
				this.$router.push({name:'crosSeting'})
				this.active = 0
			},
			lane(){
				// console.log('lane')
				this.$router.push({name:'laneSeting'})
				this.active = 1
			}
			
		}
	}
</script>

<style>
</style>
