<template>
	<div class="laneseting">
		<!-- 表格 -->
		<div class="tablecont">
			<!-- 车道数据 -->
			<el-table :data="lanetable" border="">
				<el-table-column label="车道序号" prop="laneNo" align="center"></el-table-column>
				<el-table-column label="入口方向" prop="roadNo" :formatter="towardinit" align="center"></el-table-column>
				<el-table-column label="车道类型" prop="movement"  align="center"></el-table-column>
				<el-table-column label="待行区" prop="" align="center"></el-table-column>
			</el-table>
			<!-- 道路数据 -->
			<el-table :data="roadtable" border>
				<el-table-column label="方向序号" prop="roadNo" align="center"></el-table-column>
				<el-table-column label="方向" align="center" prop="roadNo" :formatter="towardinit"></el-table-column>
				<el-table-column label="道路名" align="center" prop="roadName"></el-table-column>
				<el-table-column label="标志建筑" align="center" prop="landmarks"></el-table-column>
			</el-table>
		</div>
		<!-- 道路设置 -->
		<div class="svg-contain" id="r-setting">
			<div v-for="(item,index) in roadList" class="road" :class="item.angle">
				<svg :width="rw-25" :height="rh">
					<g fill="rgb(168, 173, 183)" >
						<!-- 出口方向车道绘制 -->
						<rect v-for="i in item.out" :width="rw" :height="((rh*0.3)/item.out)" x="0" :y="(rh*0.3/item.out)*(i-1)" ></rect>
					</g>
					<rect :width="rw" :height="1" fill="#eeee00" x="0"  :y="rh*0.3"></rect>
					<g fill="#3b434d">
						<!-- 入口方向车道绘制 -->
						<svg  v-for="i in item.in" :width="rw" :height="((rh*0.7)/item.in)" x="0" :y="rh*0.3+(rh*0.7/item.in)*(i-1)+i">
							<rect :width="rw" :height="((rh*0.7)/item.in)"  @click="openDia(index*item.in+i)" >
							</rect>
							<text x="60" y="20" font-size="12" fill="#eee">{{i}}</text>
							<image x="25" y="-2" href="@/assets/image/left2.png"></image>
						</svg>
					</g>
					
				</svg>
				<svg :width="25" :height="rh" >
					<!-- <rect :width="25" :height="rh" x="0"  :y="0" fill="#4d4e50"></rect> -->
					<defs>
						<pattern id="pattern-image"  x="0" y="0" width="1" height="8" patternUnits="userSpaceOnUse">
							<image href="@/assets/image/pattern_03.png"/>
						</pattern>
					</defs>
					<rect fill="url(#pattern-image)" :width="25" :height="rh" ></rect>
				</svg>
			</div>
			<svg height="600" width="600" >
				<!-- 具体点位由 函数根据参数生成 -->
				<path :d="path" stroke="none"  style="fill:#a8adb7;"></path>
			</svg>
		</div>
		<!-- 车道方向弹框 -->
		<el-dialog title="选择车道转向" :visible.sync="dialog">
			
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				roadList:[],
				roadNo:[],
				crossId:'',
				crossName:'',
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
				path:'',
				lanetable:[],
				roadtable:[],
				dialog:false
			}
		},
		computed:{
			rectheight:function(){
				
			}
		},
		// ???
		activated(){
			this.crossId = this.$route.query.crossId
			this.getroad()
		},
		methods:{
			getroad(){
				this.$http({
					url:'/cross/queryRoadAndLane',
					params:{
						crossId:this.crossId
					}
				}).then(res=>{
					this.roadList = res.data.roadInfoList.map((v)=>{return {angle: v.roadAngle,in:v.inLaneNumber,out:v.outLaneNumber}})
					this.roadNo = res.data.roadInfoList.map((v)=>{return v.roadNo})
					this.lanetable = res.data.laneInfoList
					this.roadtable = res.data.roadInfoList
					this.crossName = res.data.roadInfoList[0].crossName
					if(this.lanetable.length==0){
						// 初始化通道列表
						this.initlane()
					}
					// console.log(this.roadList)
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
							this.path += " L"+p[i+1].points[1].join(",") //直线
						}else{
							let cpoint = [(p[i].points[1][0]+p[i+1].points[0][0])/2,(p[i].points[1][1]+p[i+1].points[0][1])/2]
							console.log(cpoint)
							this.path += " Q"+cpoint.join(',')+' '+p[i+1].points[0].join(",") //曲线 控制点、终点(如果要做弧度曲线则更改此处控制点的坐标)
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
			// 所有道路内侧衔接点 信息
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
				
			},
			// 父组件点击下一步 响应事件
			tonext(){
				return false
			},
			// 初始化车道数据
			initlane(){
				let len = this.roadtable.length
				let No = 1
				for(let i=0;i<len;i++){
					let inlen =  this.roadtable[i].inLaneNumber
					for(let j=1;j<=inlen;j++){
						this.lanetable.push({
							crossId:this.crossId,
							crossName:this.crossName,
							isWaitable:false,
							laneNo:No++,
							movement:'',
							roadName:this.roadtable[i].roadName,
							roadNo:this.roadtable[i].roadNo
						})
					}
				}
				console.log(this.lanetable)
			},
			// 表格数据格式
			towardinit(r,c){
				switch(r.roadNo){
					case 0:
					return '北';
					break;
					case 1:
					return '东北';
					break;
					case 2:
					return '东';
					break;
					case 3:
					return '东南';
					break;
					case 4:
					return '南';
					break;
					case 5:
					return '西南';
					break;
					case 6:
					return '西';
					break;
					case 7:
					return '西北';
					break;
				}
			},
			// SVG点击
			openDia(i){
				this.dialog = true
			}
			
		}
	}
</script>

<style lang="less" scoped>
	// s设置道路宽高样式变量
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
	 .laneseting{
		 display: flex;
		 .tablecont{
		 	width: 50%;	 
		 }
	 }
	 
</style>
	<!-- @import "../../../assets/theme/svgxhj.less" -->