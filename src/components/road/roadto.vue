<template>
	<div>
		<div class="road-out">
			<select v-model="roadout">
				<option v-for="item in 9" >{{item}}</option>
			</select>
			<img src="@/assets/image/ar2_03.png" />
		</div>
		<div class="road-in">
		<select v-model="roadin">
			<option v-for="item in 9" :value="item">{{item}}</option>
		</select>
		<img src="@/assets/image/ar_03.png" />
		</div>
	</div>
</template>

<script>
	export default{
		name:'roadto',
		props:['rin','rout'],
		data(){
			return{
				roadin:this.rin,
				roadout:this.rout
			}
		},
		methods:{
			
		},
		watch:{
			rin:function(newv,oldv){
				this.roadin = newv
			},
			rout:function(newv,oldv){
				this.roadout = newv
			}
		}
	}
</script>

<style lang="less">
	/* 车道设置 */
	.road-out {
		margin-left:32px ;
		height: 39px;
		width: 120px;
		border-bottom:2px solid #d0c060 ;
	}
	.road-out img {
		display: inline-block;
		margin-left: 30px;
		margin-top: 15px;
	}
	.road-in {
		margin-left:32px ;
		height: 39px;
		width: 120px;
		border-right:2px solid #666 ;
		
	}
	.road-in img {
		display: inline-block;
		margin-left: 30px;
		margin-top: 15px;
	}
</style>
