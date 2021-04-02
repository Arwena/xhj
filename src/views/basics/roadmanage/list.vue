<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-button type="primary" round plain @click="getList">查询</el-button>
			<el-button type="primary" round plain @click="keyReset">重置</el-button>
			<el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 40px;" @click="add">新增</el-button>
			<el-button type="primary" round  icon="el-icon-edit" @click="edit">编辑</el-button>
			<el-button type="primary" round icon="el-icon-delete" @click="delet">删除</el-button>
		</div>
		<div style="overflow: hidden;" class="">
			<el-tree :data="regionList" 
					node-key="regionId" ref="tree" show-checkbox="" 
					:props="defaultProps" @check="regionCheck"
					:default-checked-keys="regionId" default-expand-all>
				
			</el-tree>
			<el-table :data="tableList" border max-height="699" @selection-change="roadChange">
				<el-table-column type="index"></el-table-column>
				<el-table-column type="selection" align="center" width="50"></el-table-column>
				<el-table-column label="路口别名" prop="crossAlias" width="150"></el-table-column>
				<el-table-column label="路口编号" prop="crossId" width="100"></el-table-column>
				<el-table-column label="路口名称" prop="crossName" width="150"></el-table-column>
				<el-table-column label="路口类型" prop="feature" width="150" :formatter="roadtypeInit"></el-table-column>
				<el-table-column label="信号机" prop="signalControllerName" width="200"></el-table-column>
				<el-table-column label="备注" prop="remark" width="250"></el-table-column>
				<el-table-column label="操作"  width="">
					<template slot-scope="handle">
						<el-link type="primary" @click="roadSetting">路口设置</el-link>
						<el-link type="primary" @click="videoSetting">视频设置</el-link>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination background="" layout="prev, pager,next"></el-pagination>
		<el-dialog :title="dialogTitle" :visible.sync="dialog">
			<el-form :model="roadform" :inline="true" >
				<el-form-item label="路口ID" label-width="120px">
					<el-input v-model="roadform.crossId"></el-input>
				</el-form-item>
				<el-form-item label="路口名称" label-width="120px">
					<el-input v-model="roadform.crossName" ></el-input>
				</el-form-item>
				<el-form-item label="路口别名" label-width="120px">
					<el-input v-model="roadform.crossAlias"></el-input>
				</el-form-item>
				<el-form-item label="所属区域" label-width="120px">
					<el-select v-model="roadform.regionId">
						<el-option v-for="item in regionMap" :key="item.regionId" :value="item.regionId" :label="item.regionName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="道路类型" label-width="120px">
					<el-select v-model="roadform.feature" placeholder="请选择道路类型">
						<el-option v-for="item in feaList" :key="item.value" :value="item.value" :label="item.description"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="信号机" label-width="120px">
					<el-select v-model="roadform.signalControllerId">
						<el-option v-for="item in signalContList" :key="item.signalControllerId" :label="item.signalControllerName"
						:value="item.signalControllerId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="GPS" label-width="120px">
					<el-input>
						<el-button slot="append">查看地图</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input  v-model="roadform.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog = false">取消</el-button>
				<el-button type="primary" @click="subRoad">保存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="路口视频列表" :visible.sync="videodia">
			<div style="overflow: hidden;">
				<span style="float: left;">路口名称:{{curRoad}}</span>
				<div style="float: right;">
					<el-button type="success" icon="el-icon-plus" circle @click = "addCam"></el-button>
					<el-button type="primary" icon="el-icon-edit" circle @click ="editCam"></el-button>
					<el-button type="danger" icon="el-icon-delete" circle @click = "delCam"></el-button>
				</div>
			</div >
			<div style="overflow: hidden;">
				<span style="float: left;">视频相机</span>
				<el-table :data="cameralist" border @selection-change="camChange" >
					<el-table-column type="selection"></el-table-column>
					<el-table-column label="相机品牌" prop="brand"></el-table-column>
					<el-table-column label="相机型号" prop="model"></el-table-column>
					<el-table-column label="道路名" prop="roadName"></el-table-column>
					<el-table-column label="方向" prop="toward"></el-table-column>
				</el-table>
			</div>
		</el-dialog>
		<el-dialog title="视频相机信息" :visible.sync="vInfoDia">
			<p style="text-align: left; text-indent: 80px; line-height: 40px; color: #000000;">路口名称:{{curRoad}}</p>
			<el-form :model="camform" :inline="true" label-position="center">
				<el-form-item label="路口ID" label-width="120px">
					<el-input v-model="camform.crossId" disabled=""></el-input>
				</el-form-item>
				<el-form-item label="关联道路" label-width="120px">
					<!-- <el-input v-model="camform.roadName"></el-input> -->
					<el-select v-model="camform.roadNo">
						<el-option v-for="item in roadList" :key="item.roadNo" :value="item.roadNo" :label="item.roadName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="相机指向" label-width="120px">
					<el-select v-model="camform.toward">
						<el-option v-for="item in towardList" :key="item.dictInfo" :value="item.dictInfoName"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="相机品牌" label-width="120px">
					<el-select v-model="camform.brand">
						<el-option v-for="item in brandlist" :key="item.dictInfo" :value="item.dictInfoName" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="相机型号" label-width="120px">
					<el-input v-model="camform.model"></el-input>
				</el-form-item>
				<el-form-item label="相机序号" label-width="120px">
					<el-input v-model="camform.cameraNo"></el-input>
				</el-form-item>
				<el-form-item label="相机IP" label-width="120px">
					<el-input v-model="camform.ipAddress"></el-input>
				</el-form-item>
				<el-form-item label="IP端口" label-width="120px">
					<el-input v-model="camform.port"></el-input>
				</el-form-item>
				<el-form-item label="登录ID" label-width="120px">
					<el-input v-model="camform.loginAccount"></el-input>
				</el-form-item>
				<el-form-item label="登录口令" label-width="120px">
					<el-input v-model="camform.loginPassword"></el-input>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item v-for="(item,index) in 10 " :label="'参数'+item" label-width="120px">
					<el-input v-model="codeParams[index]"></el-input>
				</el-form-item>
				<el-form-item label="API代码" label-width="120px">
					<el-input type="textarea" v-model="camform.jsCode"></el-input>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input type="textarea" v-model="camform.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="vInfoDia = false">取消</el-button>
				<el-button type="primary" @click="subvInfo">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				querykey:'',
				regionList:[], 
				defaultProps:{
					children:'children',
					label:'regionName',
					disabled:(d,n)=>{
						if(d.available){
							return false
						}else{
							return true
						}
					}
				},
				tableList:[],  //路口列表
				roadRows:[],             //路口选中行
				roadRowsId:[],           // 选中行ID
				regionId:[],   //路口列表条件查询ID
				dialog:false,
				dialogTitle:'',
				roadform:{             //新增路口对话框
					crossId:'',
					crossName:'',
					crossAlias:'',
					regionId:'',
					feature:'',
					remark:'',
					signalControllerId:''
				},
				signalContList:[],     //信号机列表
				feaList:[],           //路口类型列表
				regionMap:[],           //绑定所属区域列表
				videodia:false,
				cameralist:[],         //相机列表
				curRoad:'',
				vInfoDia:false,        //对话框
				isaddInfo:false,       //判断是否是新增信息对话框
				camRows:[],           
				camRowsId:[],
				camform:{              //相机对话框
					crossId:'',
					cameraNo:'',
					roadName:'',
					roadNo:'',
					toward:'',
					brand:'',
					model:'',
					ipAddress:'',
					port:null,
					loginAccount:'',
					loginPassword:'',
					codeParams:'',
					jsCode:'',
					remark:''
				},
				roadList:[],
				codeParams:[],
				brandlist:[],           //品牌列表
				towardList:[]          //方向列表
			}
		},
		mounted(){
			this.initTree()
		},
		methods:{
			getList(){
				this.$http({
					url:'/cross/query',
					method:'POST',
					data:{
						blurry:this.querykey,
						regionIds:this.regionId
					}
				}).then(res =>{
					this.tableList = res.data.list
				})
			},
			// 初始化区域树
			initTree(){
				this.$http({
					url:'/cross/tree'
				}).then(res =>{
					this.regionList = res.data.tree
					this.regionId.push( res.data.firstAvailableRegionId)
					console.log(this.regionId)
					this.getList()
					this.initdialog()
					// this.$refs.tree.setCheckedKey([])
				})
			},
			//路口类型初始化
			roadtypeInit(r,c){
				let data = this.feaList.filter(function(i){return i.value == r.feature})
				return data[0].description
			},
			// 区域树点选处理
			regionCheck(d,c){
				// console.log(d,c)
				if(c.checkedKeys.length == 0){
					this.regionId = []
				}else{
					this.regionId = c.checkedKeys
				}
				this.getList()
			},
			// 路口列表点选处理
			roadChange(val){
				this.roadRows = val
				this.roadRowsId = val.map(function(v){return v.crossId})
			},
			// 模糊查询重置
			keyReset(){
				this.querykey = ''
			},
			// 初始化新增对话框
			initdialog(){
				// 路口对话框
				this.$http({url:'/cross/getCrossFeatureList'}).then(res =>{this.feaList = res.data})
				this.$http({url:'/region/getRegionMap'}).then(res=>{this.regionMap = res.data})
				this.$http({url:'/signalController/getSignalControllerMap'}).then(res=>{this.signalContList = res.data})
				// 视频对话框
				this.$http({
					url:'/dict/info/query',
					params:{
						dictType:'roadDirection'
					}
					}).then(res=>{this.towardList = res.data})
				this.$http({
					url:'/dict/info/query',
					params:{
						dictType:'videoBrand'
					}
					}).then(res=>{this.brandlist = res.data})
			},
			// 新增
			add(){
				this.dialog = true
				this.dialogTitle = '新增路口'
				Object.assign(this.$data.roadform,this.$options.data().roadform)
				
			},
			// 编辑
			edit(){
				if(this.roadRows.length == 0){
					this.$message({
						message:'请选择一条修改项',
						type:'warning'
					})
				}else if(this.roadRows >1){
					this.$message({
						message:'只能选择一条修改',
						type:'error'
					})
				}else{
					this.dialogTitle = '编辑路口'
					this.dialog = true
					// this.initdialog()
					this.$http({
						url:'/cross/info',
						params:{
							crossId:this.roadRowsId[0]
						}
					}).then(res =>{
						this.roadform = res.data
					})
				}
				
			},
			delet(){
				let v = this.roadRows
				if(v.length == 0 ){
					this.$message({
						message:'请至少选择一条删除项'
					})
				}else{
					this.$msgbox({
						message:'确定是否删除？',
						title:'消息',
						showCancelButton:true
					}).then(()=>{
						this.$http({
							url:'/cross/delete',
							method:'post',
							data:this.roadRowsId
						}).then(res=>{
							this.$message({
								message:res.message,
								type:'success'
							})
							this.getList()
						})
					})
				}
			},
			subRoad(){
				let subUrl = ''
				if(this.dialogTitle =='新增路口'){
					subUrl = '/cross/add'
				}else{
					subUrl = '/cross/update'
				}
				this.$http({
					url:subUrl,
					data:this.roadform,
					method:'POST'
				}).then(res=>{
					this.$message({
						message:res.message,
						type:'success'
					})
					this.dialog = false
					this.getList()
				})
			},
			//获取视频列表
			getcamList(){
				this.$http({
					url:'/videoCamera/query',
					params:{
						crossId:this.roadRowsId[0]
					}
				}).then(res =>{
					this.cameralist = res.data
				})
			},
			//视频设置
			videoSetting(){
				if(this.roadRowsId.length == 1){
					this.curRoad = this.roadRows[0].crossAlias
					this.videodia = true
					//请求相机列表
					this.getcamList()
					//请求路口道路列表
					this.$http({
						url:'/road/getRoadMap',
						params:{
							crossId:this.roadRowsId[0]
						}
					}).then(res=>{
						this.roadList = res.data
					})
				}else{
					this.$message({
						message:'请选择当前路口',
						type:'warning'
					})
				}
				
			},
			// 视频相机表格选中切换
			camChange(val){
				this.camRows = val
				this.camRowsId = val.map(function(v){return {'cameraNo':v.cameraNo,'crossId':v.crossId}})
			},
			// 新增相机
			addCam(){
				Object.assign(this.$data.camform,this.$options.data().camform)
				this.camform.crossId = this.roadRowsId[0]
				if(this.roadList.length == 0){
					this.$message({
						message:'暂无道路，请先设置道路',
						type:'warning'
					})
				}else{
					this.vInfoDia = true
					this.isaddInfo = true
				}
			},
			// 修改相机
			editCam(){
				if(this.camRows.length ==0 || this.camRows.length >1){
					this.$message({
						message:'请选择一条修改项',
						type:'warning'
					})
				}else{
					this.isaddInfo = false
					this.vInfoDia = true
					this.$http({
						url:'/videoCamera/info',
						params:{
							cameraNo:this.camRows[0].cameraNo,
							crossId:this.camRows[0].crossId
						}
					}).then(res=>{
						this.camform = res.data
						this.codeParams = this.camform.codeParams.split('%#',10)
					})
				}
			},
			// 删除相机
			delCam(){
				let v = this.camRows
				if(v.length == 0 ){
					this.$message({
						message:'请至少选择一条删除项'
					})
				}else{
					this.$msgbox({
						message:'确定是否删除？',
						title:'消息',
						showCancelButton:true
					}).then(()=>{
						this.$http({
							url:'/videoCamera/delete',
							method:'post',
							data:this.camRowsId
						}).then(res=>{
							this.$message({
								message:res.message,
								type:'success'
							})
							this.getcamList()
						})
					})
				}
			},
			//提交视频相机信息表单
			subvInfo(){
				let subUrl = ''
				if(this.isaddInfo){
					subUrl = '/videoCamera/add'
				}else{
					subUrl = '/videoCamera/update'
				}
				this.camform.codeParams = this.codeParams.join('%#')
				this.$http({
					url:subUrl,
					data:this.camform,
					method:'POST'
				}).then(res =>{
					this.$message({
						message:res.message,
						type:'success'
					})
					this.vInfoDia = false
					this.getcamList()
				})
			},
			//路口设置跳转
			roadSetting(){
				if(this.roadRowsId.length == 1){
					console.log(this.roadRowsId)
					this.$router.push({name:'rSetting', params:{ crossId: this.roadRowsId[0]}})
				}
			}
			
		}
	}
</script>

<style lang="less" scoped>
	
	.el-tree{
		float: left;
		width: 250px;
		height: 699px;
		background: none;
		padding: 10px;
		// margin-right: 10px;
		// margin-top: 30px;
		margin: 30px 10px 0 10px;
		// overflow: scroll;
		background: #024f88;
		color: #fff;
		
	}
	.el-table{
		float: right;
		margin-right: 10px;
		max-width: 81%;
		max-height: 600px;
		.el-link{
			margin:0 5px;
		}
	}
</style>
<style lang="less">
	.el-tree-node__content:hover{
		background-color:#0a4978;
	}
	.el-tree-node:focus>.el-tree-node__content{
		background-color:#0a4978;
	}
	
	.el-dialog {
		.el-table {
			color: #333;
			margin-top:10px ;
			max-width: 90%!important;
			.el-table__body tr:hover >td{
					background: #ecf5ff!important;
				}
			
		}
	}
</style>