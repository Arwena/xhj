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
					<g fill="#3b434d" class="lanein">
						<!-- 入口方向车道绘制 -->
						<svg  v-for="i in item.in" :width="rw" :height="((rh*0.7)/item.in)" x="0" :y="rh*0.3+(rh*0.7/item.in)*(i-1)+i"  >
							<rect :width="rw" :height="((rh*0.7)/item.in)"  @click="openDia(index*item.in+i)" >
							</rect>
							<text x="60" y="20" font-size="12" fill="#eee" >{{i}}</text>
							<image x="25" y="-2" href="@/assets/image/left2.png"></image>
						</svg>
					</g>
					
				</svg>
				<!-- 人行横道 -->
				<svg :width="25" :height="rh" >
					<defs>
						<pattern id="pattern-image"  x="0" y="0" width="1" height="8" patternUnits="userSpaceOnUse">
							<image href="@/assets/image/pattern_03.png"/>
						</pattern>
					</defs>
					<rect fill="url(#pattern-image)" :width="25" :height="rh" ></rect>
				</svg>
			</div>
			<!-- 道路衔接部分 -->
			<svg height="600" width="600" >
				<!-- 具体点位由 函数根据参数生成 -->
				<path :d="path" stroke="none"  style="fill:#a8adb7;"></path>
			</svg>
		</div>
		<!-- 车道方向弹框 -->
		<el-dialog title="选择车道转向" :visible.sync="dialog" >
			<el-tabs type="card">
				<el-tab-pane label="选择车道转向">
					<!-- 循环列出当前方向 -->
					<div>
						<div v-for="(item,index) in towardlist" class="inblock">
							<el-image style="width: 60px;height: 60px;"  :src="item.url" fit="scale-down" @click="SelectTo(index)"></el-image>
							<span class="imglab">{{item.label}}</span>
						</div>
						<!-- <div > -->
							<!-- <el-card shadow="hover" style="width: 60px;height: 60px;">
								<img src="@/assets/image/goStraight2.png" fit="fill"/>
							</el-card> -->
							<!-- <el-image style="width: 60px;height: 60px;"  :src="url" fit="scale-down"></el-image> 
							<span class="imglab">直行</span>
						</div> -->
					</div>
				</el-tab-pane>
				<el-tab-pane label="自定义车道转向"></el-tab-pane>
			</el-tabs>
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
				rw:120,
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
				dialog:false,
				currentLane:'',
				towardlist:[  // 弹窗、车道、表格，关联数据集合
					{label:'直行',url:require('@/assets/image/goStraight2.png')},
					{label:'左转',url:require('@/assets/image/left2.png')},
					{label:'右转',url:require('@/assets/image/right2.png')},
					{label:'掉头',url:require('@/assets/image/round2.png')}
				]
				
			}
		},
		computed:{
		},
		// 激活状态下获取信息
		activated(){
			this.crossId = this.$route.query.crossId
			this.getroad()
		},
		methods:{
			// 获取当前车道设置页信息用于回显
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
						// 当还未设置过车道时，初始化通道列表
						this.initlane()
					}
					// console.log(this.roadList)
					// 计算衔接点坐标信息
					this.compuPoints()
				})
			},
			compuPoints(){
				// 获取当前道路数量
				let len = this.roadList.length
				// 定义坐标集合
				let p = []
				// 数组排序，相邻两项 相同，则去重，画图
				// 计算出所有的点，
				this.allpoint()
				// 根据道路类，匹配获取当前所设置的道路的衔接点坐标
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
				// 根据上面得出的衔接点坐标，拼接路径中的path属性  画出中间衔接部分的图形
				// 思路：一条道路的一端有两个坐标点、相邻的道路会有重合坐标点，判断道路序号是否相邻，是则忽略一次重合点的连接，否，则连接上一条道路的第二个点坐标和下一道路的第一个点坐标
				// 注意：序号0和7也是响铃的，需要单独判断\  Cpoint是控制点坐标，目前是用的直线连接所以可有可无，如果需要有弧度的曲线，则需要计算Cpoint位置，增加控制弧度
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
			// 计算出 所有道路内侧衔接点 坐标
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
			// SVG车道点击事件
			openDia(i){
				this.dialog = true
				console.log(i)
			},
			// 弹窗中点击事件：选择车道类型
			SelectTo(i){
				
			}
			
		}
	}
</script>

<style lang="less" scoped>
	// s设置道路宽高样式变量
	@widx:120px;
	@heiy:160px;
	
	@contx:300px;
	@conty:300px;
	@import  "~@/assets/theme/svgxhj.less";
	// 设置表格超出屏幕长度后的滚动样式
	 .laneseting{
		 display: flex;
		 .tablecont{
		 	width: 50%;	
			 height: 700px;
			 overflow-y: scroll;
		 }
		 .tablecont::-webkit-scrollbar {
		         display: none;
		  }
	 }
	 
	 
</style>
<style lang="less">
	.lanein{
		// -webkit-transform:scale(1,-1);
	}
	.laneseting{
		.el-dialog{
			 min-height: 400px;
			.el-card__body{
					 padding: 14px!important;
			}
			.inblock{
				display: inline-block;
				width: 20%;
				.el-image{
					border: 1px solid #999999;
				}
				.imglab{
					display: block;
					margin-top:20px ;
				}
			}
		}
	}
	
	
	
</style>
	<!-- @import "../../../assets/theme/svgxhj.less" -->