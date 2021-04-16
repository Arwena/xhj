<template>
	<div >
		<!-- 表格 -->
		<div></div>
		<!-- 道路设置 -->
		<div class="svg-contain" id="r-setting">
			<div v-for="item in roadList" class="road" :class="item"></div>
			<svg height="600" width="600" >
				<!-- 具体点位由 函数根据参数生成 -->
				<path :d="path" stroke="none"  style="fill:#a8adb7;"></path>
			</svg>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				roadList:[],
				roadNo:[],
				crossId:'',
				rw:100,
				rh:160,
				cx:300,
				cy:300,
				points:[],
				r0:[],
				r45:[],
				r90:[],
				r135:[],
				r180:[],
				r225:[],
				r270:[],
				r315:[],
				path:''
			}
		},
		activated(){
			this.crossId = this.$route.query.crossId
			this.getroad()
		},
		methods:{
			getroad(){
				this.$http({
					url:'/road/query',
					params:{
						crossId:this.crossId
					}
				}).then(res=>{
					this.roadList = res.data.list.map((v)=>{return v.roadAngle})
					this.roadNo = res.data.list.map((v)=>{return v.roadNo})
					console.log(this.roadList)
					// 计算衔接点坐标信息
					this.compuPoints()
				})
			},
			compuPoints(){
				let len = this.roadList.length
				let p = []
				// 数组排序，相邻两项 相同，则去重，画图
				// 计算出所有的点，匹配道路类，获取点，方便排序
				this.allpoint()
				for(let i=0;i<len;i++){
					switch(this.roadNo[i]){
						case 0:
						p.push({
							no:this.roadNo[i],
							points:this.r90
						})
						break;
						case 1:
						p.push({
							no:this.roadNo[i],
							points:this.r135
						})
						break;
						case 2:
						p.push({
							no:this.roadNo[i],
							points:this.r180
						})
						break;
						case 3:
						p.push({
							no:this.roadNo[i],
							points:this.r225
						})
						break;
						case 4:
						p.push({
							no:this.roadNo[i],
							points:this.r270
						})
						break;
						case 5:
						p.push({
							no:this.roadNo[i],
							points:this.r315
						})
						break;
						case 6:
						p.push({
							no:this.roadNo[i],
							points:this.r0
						})
						break;
						case 7:
						p.push({
							no:this.roadNo[i],
							points:this.r45
						})
						break;
					}
				}
				console.log(p)
				this.path = "M "+p[0].points[1].join(",")
				for(let i = 0; i<p.length ;i++){
					if(i != p.length-1){
						if((p[i].no + 1 )== p[i+1].no){
							// console.log('111111')
							this.path += " L"+p[i+1].points[1].join(",") //直线
						}else{
							let cpoint = [(p[i].points[1][0]+p[i+1].points[0][0])/2,(p[i].points[1][1]+p[i+1].points[0][1])/2]
							console.log(cpoint)
							this.path += " Q"+cpoint.join(',')+' '+p[i+1].points[0].join(",") //曲线 控制点、终点
							this.path += " L"+p[i+1].points[1].join(",")
						}
					}else{
						if(p[i].no == 7 && p[0].no == 0){
							// 序号为7
							this.path += " Z"
						}else{
							let cpo =  [(p[i].points[1][0]+p[0].points[0][0])/2,(p[i].points[1][1]+p[0].points[0][1])/2]
							this.path += " Q" + cpo.join(',') +" "+ p[0].points[0].join(',')+" Z"
						}
					}
					
				}
			},
			allpoint(){
				let x1 = [this.cx-this.rh/2-Math.sin(45 * Math.PI / 180)*this.rh,this.cy+this.rh/2]
				let x2 = [this.cx-this.rh/2-Math.sin(45 * Math.PI / 180)*this.rh,this.cy-this.rh/2]
				let x3 = [this.cx-this.rh/2,this.cy-this.rh/2-Math.sin(45 * Math.PI / 180)*this.rh]
				let x4 = [this.cx+this.rh/2,this.cy-this.rh/2-Math.sin(45 * Math.PI / 180)*this.rh]
				let x5 = [this.cx+this.rh/2+Math.sin(45 * Math.PI / 180)*this.rh,this.cy-this.rh/2]
				let x6 = [this.cx+this.rh/2+Math.sin(45 * Math.PI / 180)*this.rh,this.cy+this.rh/2]
				let x7 = [this.cx+this.rh/2,this.cy+this.rh/2+Math.sin(45 * Math.PI / 180)*this.rh]
				let x8 = [this.cx-this.rh/2,this.cy+this.rh/2+Math.sin(45 * Math.PI / 180)*this.rh]
				this.r0 = [x1,x2]
				this.r45 = [x2,x3]
				this.r90 = [x3,x4]
				this.r135 = [x4,x5]
				this.r180 = [x5,x6]
				this.r225 = [x6,x7]
				this.r270 = [x7,x8]
				this.r315 = [x8,x1]
				
			}
		}
	}
</script>

<style lang="less" scoped>
	@widx:100px;
	@heiy:160px;
	
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
