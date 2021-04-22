<template>
	<div class="noth">
		<el-steps :active="active" finish-status="success" simple="">
			<el-step v-for="(item,index) in steps" :title="item" @click.native="handleStep(index)"></el-step>
			
		</el-steps>
		<div>
			<keep-alive>	
				<router-view ref="config"/>
			</keep-alive>
		</div>
		<div class="topbtn">
			<el-button type="primary" round plain @click="topre">返 回</el-button>
			<el-button type="primary" round plain @click="tonext">下一步</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				active:0,
				stepSeted:[0],
				crossId:'',
				steps:["路口配置","车道配置","通道配置","绿冲突定义","周期方案","调度管理"]
			}
		},
		mounted(){
			this.crossId = this.$route.query.crossId
			this.$http({
				url:'/cross/configMap',
				params:{
					crossId:this.crossId
				}
			}).then(res=>{
				// 返回当前设置步骤，并设置active
				switch(res.data.currentConfig){
					case 'road':
					this.active = 0;
					break;
					case 'lane':
					this.active = 1;
					this.stepSeted.push(this.active)
					break;
					case 'channelLamp':
					this.active = 2;
					for(let i = 1; i<=this.active;i++){	this.stepSeted.push(i)}
					break;
					case 'greenConflict':
					this.active = 3;
					for(let i = 1; i<=this.active;i++){	this.stepSeted.push(i)}
					break;
					case 'phase':
					this.active = 4;
					for(let i = 1; i<=this.active;i++){	this.stepSeted.push(i)}
					break;
					case 'datePlan':
					this.active = 5;
					for(let i = 1; i<=this.active;i++){	this.stepSeted.push(i)}
					break;
				}
			})
		},
		watch:{
			'$route':function(n,o){
				console.log(n)
			},
			active:function(n,o){
				switch(n){
					case 0:
					this.$router.push({name:'crosSeting',query:{ crossId: this.crossId}});
					break;
					case 1:
					this.$router.push({name:'laneSeting',query:{ crossId: this.crossId}});
					break;
				}
			}
		},
		methods:{
			async tonext(){
				// this.isnext = true
				// 触发当前子组件校验
				let s = await this.$refs.config.tonext()
				if(s){
					this.active++
					this.stepSeted.push(this.active)
				}
				
			},
			// 返回
			topre(){
				// this.isnext = false
				if(this.active == 0){
					this.$router.push({name:'roadList'})
				}else{
					this.active --
				}
			},
			handleStep(i){
				if(this.stepSeted.indexOf(i)!=-1){
					this.active = i
				}else{
					this.$message({
						message:'请按顺序先完成当前设置,',
						type:'warning'
					})
				}
			}
			// cross(){
			// 	this.active = 0
			// },
			// lane(){
			// 	this.active = 1
			// }
			
		}
	}
</script>

<style>
</style>
