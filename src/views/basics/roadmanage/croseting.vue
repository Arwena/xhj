<template>
	<div>
		<!-- 路口设置第一步 -->
		<div class="svg-contain" id="r-setting">
			<input type="checkbox" value="r90" style="top: 60px;left: 290px;" v-model="roads"/>
			<div class="road r90">
				<RoadTo v-show="roads.includes('r90')" ref="r90" :rin="inandout.r90.in" :rout="inandout.r90.out"></RoadTo>
			</div>
			<input type="checkbox" value="r135" style="left:455px; top: 125px;" v-model="roads"/>
			<div class="road r135"  >
				<RoadTo v-show="roads.includes('r135')" ref="r135" :rin="inandout.r135.in" :rout="inandout.r135.out"></RoadTo>
			</div>
			<input type="checkbox" value="r180" style="left:520px; top: 290px;" v-model="roads"/>
			<div class="road r180">
				<RoadTo v-show="roads.includes('r180')" ref="r180" :rin="inandout.r180.in" :rout="inandout.r180.out"></RoadTo>
			</div>
			<input type="checkbox" value="r225" style="left: 455px; top:455px" v-model="roads"/>
			<div class="road r225" >
				<RoadTo v-show="roads.includes('r225')" ref="r225" :rin="inandout.r225.in" :rout="inandout.r225.out"></RoadTo>
			</div>
			<input type="checkbox" value="r270" style="top: 520px;left: 290px;" v-model="roads"/>
			<div class="road r270" key='r270'>
				<RoadTo v-show="roads.includes('r270')" ref="r270" :rin="inandout.r270.in" :rout="inandout.r270.out"></RoadTo>
			</div>
			<input type="checkbox" value="r315"  style="left: 125px; top:455px;" v-model="roads"/>
			<div class="road r315" >
				<RoadTo v-show="roads.includes('r315')" ref="r315" :rin="inandout.r315.in" :rout="inandout.r315.out"></RoadTo>
			</div>
			<input type="checkbox" name="r0" value="r0" style="left: 60px; top: 290px;" v-model="roads"/>
			<div class="road r0">
				<RoadTo v-show="roads.includes('r0')" ref="r0" :rin="inandout.r0.in" :rout="inandout.r0.out"></RoadTo>
			</div>
			<input type="checkbox" value="r45" style="left: 125px; top: 125px;" v-model="roads"/>
			<div class="road r45" >
				<RoadTo v-show="roads.includes('r45')" ref="r45" :rin="inandout.r45.in" :rout="inandout.r45.out"></RoadTo>
			</div>
			
			<svg height="600" width="600" >
				<!-- <polygon points="204,260 260,204 340,204 396,260 396,340 340,396 260,396 204,340"style="fill:#a8adb7;"/>-->
				<polygon :points="points"
				  style="fill:#a8adb7;"/> 
			</svg>
		</div>
		<!-- <el-button type="primary" round plain @click="savecro">保存</el-button> -->
	</div>
</template>

<script>
	import RoadTo from '@/components/road/roadto.vue'
	export default{
		components:{RoadTo},
		data(){
			return {
				widx:154,
				heiy:80,
				r:300,
				x1:'',
				x2:'',
				x3:'',
				x4:'',
				x5:'',
				x6:'',
				x7:'',
				x8:'',
				points:[],
				roads:[],
				inandout:{
					r0:{
						in:0,
						out:0
					},
					r45:{
						in:0,
						out:0
					},
					r90:{
						in:0,
						out:0
					},
					r135:{
						in:0,
						out:0
					},
					r180:{
						in:0,
						out:0
					},
					r225:{
						in:0,
						out:0
					},
					r270:{
						in:0,
						out:0
					},
					r315:{
						in:0,
						out:0
					}
					
				},
				// 步骤条
				active:0,
				crossId:'',
				saveStatus:false,
				getdata:[],
				sendData:[],
				datachange:false
			}
		},
		created(){
			// this.getcro()
		},
		mounted(){
			this.crossId = this.$route.query.crossId
			this.x1 = [this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r+this.heiy/2]
			this.x1 = this.x1.join(',')
			this.x2 =  [this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r-this.heiy/2].join(',')
			this.x3 =  [this.r-this.heiy/2 , this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x4 =  [this.r+this.heiy/2 , this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x5 =   [this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r-this.heiy/2].join(',')
			this.x6 =   [this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r+this.heiy/2].join(',')
			this.x7 =  [this.r+this.heiy/2 , this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x8 =  [this.r-this.heiy/2 , this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.points = [this.x1,this.x2,this.x3,this.x4,this.x5,this.x6,this.x7,this.x8].join(' ')
			// 获取当前路口设置数据
			this.getcro()
		},
		methods:{
			getcro(){
				this.$http({
					url:'/road/query',
					params:{
						crossId:this.crossId
					}
				}).then(res=>{
					if(res.data.length!=0){
						this.getdata = res.data
						this.roads = res.data.map((v)=>{return v.roadAngle})
						// 道路数据集合
						res.data.forEach(item =>{
							this.inandout[item.roadAngle].in = item.inLaneNumber 
							this.inandout[item.roadAngle].out = item.outLaneNumber
						})
						// console.log(this.inandout)
					}else{
						
					}
				})
			},
			async savecro(func){
				// this.comdata()
				// console.log(darr)
				let _this = this
				let re = await this.$http({
					url:'/road/saveRoadList',
					method:'POST',
					data:this.sendData
				}).then(res=>{
					// 判断状态成功
					_this.$message({
						message:res.message,
						type:'success'
					})
					// 返回状态
					_this.saveStatus = true
				})
				return _this.saveStatus
			},
			comdata(){
				let darr = []
				for(let i=0;i<this.roads.length;i++){
					darr[i] ={
						crossId:this.crossId,
						outLaneNumber:0,
						inLaneNumber:0,
						roadNo:0,
						roadAngle:this.roads[i]
					}
				}
				// console.log(this,'1111')
				let _this = this
				darr.forEach(function(v){	
					switch(v.roadAngle){
						case 'r90':
						v.roadNo = 0;
						v.outLaneNumber = _this.$refs.r90.roadout
						v.inLaneNumber = _this.$refs.r90.roadin
						break;
						case 'r135':
						v.roadNo = 1;
						v.outLaneNumber = _this.$refs.r135.roadout
						v.inLaneNumber = _this.$refs.r135.roadin
						break;
						case 'r180':
						v.roadNo = 2;
						v.outLaneNumber = _this.$refs.r180.roadout
						v.inLaneNumber = _this.$refs.r180.roadin
						break;
						case 'r225':
						v.roadNo = 3;
						v.outLaneNumber = _this.$refs.r225.roadout
						v.inLaneNumber = _this.$refs.r225.roadin
						break;
						case 'r270':
						v.roadNo = 4;
						v.outLaneNumber = _this.$refs.r270.roadout
						v.inLaneNumber = _this.$refs.r270.roadin
						break;
						case 'r315':
						v.roadNo = 5;
						v.outLaneNumber = _this.$refs.r315.roadout
						v.inLaneNumber = _this.$refs.r315.roadin
						break;
						case 'r0':
						v.roadNo = 6;
						v.outLaneNumber = _this.$refs.r0.roadout
						v.inLaneNumber = _this.$refs.r0.roadin
						break;
						case 'r45':
						v.roadNo = 7;
						v.outLaneNumber = _this.$refs.r45.roadout
						v.inLaneNumber = _this.$refs.r45.roadin
						break;
					}
				})
				this.sendData = darr
				// 
				let roads = darr.map((v)=>{return v.roadAngle})
				// 道路数据集合
				let inandout0 ={}
				Object.assign(inandout0,_this.$options.data().inandout)
				darr.forEach(item =>{
					inandout0[item.roadAngle].in = item.inLaneNumber 
					inandout0[item.roadAngle].out = item.outLaneNumber
				})
				// 比较验证
				if(this.compara(roads,this.roads,'array') && this.compara(inandout0,this.inandout,'obj')){
					return true
				}else{
					return false
				}
			},
			// 
			compara(a,b,type){
				if(type =='array'){
					if (a.length != b.length){
						return false
					}
					for (var i = 0, l = a.length; i < l; i++) {
					      if (a[i] != b[i]) { 
					           return false;   
					       }           
				    }       
					    return true;
				}else{
					for(let angle in a ){
						for(let inout in a[angle]){
							if(a[angle][inout] != b[angle][inout]) {
							     return false;
							}
						}
					}
					return true
				}
			},
			
			async tonext(){
				let _this = this
				let flag = false
				if(this.roads.length == 0){
					this.$message({
						message:'当前数据为空,请设置',
						type:'warning'
					})
					return false
				}else{
					if(!this.comdata()){
						 await _this.$msgbox({
							message:'确定保存更改',
							title:'消息',
							showCancelButton:true,
							cancelButtonText:'不保存'
						}).then(async()=>{
							let s =await _this.savecro()
							if(s){
								flag = true
							}
						}).catch(()=>{
							flag = true
						})
						return flag
					}else{
						return true
					}
				}
				
			}
		},
		watch:{
			
		},
		// async beforeRouteLeave(to, from, next) {
		//     // 导航离开该组件的对应路由时调用
		//     // 可以访问组件实例 `this`
		// 	// 要求离开页面时判断是否保存新增修改、或者提示当前未存在数据 并增加弹框确认操作，
		// 	let _this = this
		// 	if(!this.$parent.isnext){
		// 		next()
		// 	}else{
		// 		if(this.roads.length == 0){
		// 			this.$message({
		// 				message:'当前数据为空,请设置',
		// 				type:'warning'
		// 			})
		// 			next(false)
		// 			this.$parent.active--
		// 		}else{
		// 			if(!this.comdata()){
		// 				this.$msgbox({
		// 					message:'确定保存更改',
		// 					title:'消息',
		// 					showCancelButton:true,
		// 					cancelButtonText:'不保存'
		// 				}).then(async ()=>{
		// 					let s =await _this.savecro()
		// 					if(s){
		// 						this.$parent.stepSeted.push(this.$parent.active)
		// 						next()
		// 					}
		// 				}).catch(()=>{
		// 					this.$parent.stepSeted.push(this.$parent.active)
		// 					next()
		// 				})
						
		// 			}else{
		// 				this.$parent.stepSeted.push(this.$parent.active)
		// 				next()
		// 			}
		// 		}
				
		// 	}
		//   }
	}
</script>

<style lang="less">
	// @import url("~@/assets/theme/svgxhj.less");
	@widx:154px;
	@heiy:80px;
	
	@contx:300px;
	@conty:300px;
	 
	 .rotate(@de){
	 		transform: rotate(@de);
	 		-ms-transform:rotate(@de);
	 		-moz-transform:rotate(@de);
	 		-webkit-transform:rotate(@de);
	 		-o-transform:rotate(@de); 
	 }
	 .r(@deg){
	 	.rotate(@deg);
	 	select{
	 		margin: 10px 0px 10px 0px;
	 		.rotate(-@deg)
	 	}
	 }
	 .svg-contain{
	 	// background-color: #eee;
	 	width: @contx*2;
	 	height: @conty*2;
	 	margin:30px auto;
	 	position: relative;
	 }
	 /* 设置路口 */
	 .svg-contain input{
	 	position: absolute;
	 	// top: 200;
	 	// left: 0;
	 	z-index: 2;
	 }
	 .road {
	 	width: @widx;
	 	height: @heiy;
	 	background-color: #a8adb7;
	 	position: absolute;
	 }
	 .r0{
	 	top: @conty - @heiy/2;
	 	left:ceil(@contx - @heiy/2 - @heiy*sin(45deg) - @widx) 
		// left: 50px;
	 }
	 .r45{
	 	top:ceil( @conty - @heiy/2 - (@heiy*sin(45deg))/2 - (@heiy/2 + @widx/2*sin(45deg)));
	 	left:ceil(@contx - @heiy/2- (@heiy*sin(45deg))/2 - (@widx/2 + @widx/2*cos(45deg)));
	 	.r(45deg);
	 }
	 .r90{
	 	top: ceil(@conty - @heiy/2 - @heiy*sin(45deg) - (@heiy/2+@widx/2));
	 	left:ceil(@contx - @widx/2);
	 	.r(90deg)
	 }
	 .r135{
	 	top:ceil( @conty - @heiy/2 - (@heiy*sin(45deg))/2 - (@heiy/2 + @widx/2*sin(45deg)));
	 	left: floor(@contx + @heiy/2+ (@heiy*sin(45deg))/2 - (@widx/2 - @widx/2*cos(45deg)));
	 	.r(135deg)
	 }
	 .r180{
	 	top:  @conty - @heiy/2;
	 	left: floor(@contx + @heiy/2 + @heiy*sin(45deg));
	 	.r(180deg)
	 }
	 .r225{
	 	top:floor( @conty + @heiy/2 + (@heiy*sin(45deg))/2 - (@heiy/2 - @widx/2*sin(45deg)));
	 	left: floor(@contx + @heiy/2+ (@heiy*sin(45deg))/2 - (@widx/2 - @widx/2*cos(45deg)));
	 	.r(225deg)
	 }
	 .r270{
	 	top: floor(@conty + @heiy/2 + @heiy*sin(45deg) - (@heiy/2-@widx/2));
	 	left: ceil(@contx - @widx/2);
	 	.r(270deg)
	 }
	 .r315{
	 	top: floor( @conty + @heiy/2 + (@heiy*sin(45deg))/2 - (@heiy/2 - @widx/2*sin(45deg)));
	 	left: ceil(@contx - @heiy/2- (@heiy*sin(45deg))/2 - (@widx/2 + @widx/2*cos(45deg)));
	 	.r(315deg)
	 }
	 
	 
	 
	 
</style>
