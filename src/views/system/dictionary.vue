<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-button type="primary" round plain @click="getList">查询</el-button>
			<el-button type="primary" round plain @click="keyReset">重置</el-button>
			<el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 40px;" @click="add">新增</el-button>
			<el-button type="primary" round icon="el-icon-edit" @click="edit">编辑</el-button>
			<el-button type="primary" round icon="el-icon-delete" @click="delet">删除</el-button>
		</div>
		<el-table :data="dicList" border @expand-change="load" max-height="699" ref="dicty">
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-table :data="dicInfoList" @selection-change="handleSelect" border="">
						<el-table-column type="index"></el-table-column>
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="字典信息名称" prop="dictInfoName" width="200"></el-table-column>
						<el-table-column label="字典信息编码" prop="dictInfo" width="200"></el-table-column>
						<el-table-column label="字典类型编码" prop="dictType"></el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column type="index"></el-table-column>
			<!-- <el-table-column type="selection"></el-table-column> -->
			<el-table-column label="字典名称" prop="dictTypeName" width="200"></el-table-column>
			<el-table-column label="字典类型" prop="dictType" width="200"></el-table-column>
			<el-table-column label="备注" prop="remark"></el-table-column>
		</el-table>
		<el-pagination @current-change="pageChange" background layout="prev, pager, next" :total="pager.totalcount" :hide-on-single-page="true" ></el-pagination>
		<el-dialog :title="dialogTitle" :visible.sync="dialog">
			<el-form :model="dictform" :inline='true' label-position="center">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="dictform.dictInfoName"></el-input>
				</el-form-item>
				<el-form-item label="编码" label-width="120px">
					<el-input v-model="dictform.dictInfo"></el-input>
				</el-form-item>
				<el-form-item label="类型" label-width="120px">
					<el-select v-model="dictform.dictType" placeholder="请选择类型">
						<el-option v-for="item in dicList" :key="item.dictType" :label="item.dictTypeName" :value="item.dictType"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序" label-width="120px">
					<el-input v-model="dictform.sort"></el-input>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input type="textarea" v-model="dictform.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog=false">取消</el-button>
				<el-button @click="submitForm" type="primary">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				dicList:[],
				querykey:'',
				dicInfoList:[],
				pager:{
					totalcount:0,
					currentPage:1
				},
				dialogTitle:'',
				dialog:false,
				dictform:{
					dictInfo:'',
					dictInfoName:'',
					dictType:'',
					remark:'',
					sort:0
				},
				selectRows:[],
				selectRowsInfo:{
					dictInfos:[],
					dictType:''
				}
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				this.$http({
					url:'/dict/type/query',
					params:{
						blurry:this.querykey,
						currentPage:this.pager.currentPage,
						pageSize:10
					}
				}).then(res=>{
					this.dicList = res.data.list
				})
			},
			load(r,exrow){
				// console.log(r,exrow)
				// if(exrow.length == 1){
					// console.log(exrow)
					this.$http({
						url:'/dict/info/query?dictType='+r.dictType
					}).then(res =>{
						this.dicInfoList = res.data
					})
				// }else if(exrow.length == 2){
				// 	this.$refs.dicty.toggleRowExpansion(exrow[0])
				// 	return
				// }
			},
			handleSelect(val){
				this.selectRows = val
				this.selectRowsInfo.dictInfos = val.map(function(v){return v.dictInfo})
				if(val.length >0){
					this.selectRowsInfo.dictType = val[0].dictType
				}
				console.log(this.selectRowsInfo)
			},
			keyReset(){
				this.querykey = ''
			},
			formInit(){
				let form = {
					dictInfo:'',
					dictInfoName:'',
					dictType:'',
					remark:'',
					sort:0
				}
				this.dictform = form
			},
			pageChange(val){
				this.pager.currentPage = val
				this.getList()
			},
			add(){
				this.dialog=true
				this.dialogTitle = '新增字典信息'
				this.formInit()
			},
			edit(){
				if(this.selectRows.length ==0){
					this.$message({
						message:'请选择一条修改项',
						type:'warning'
					})
				}else if(this.selectRows.length >1){
					this.$message({
						message:'只能选择一条修改',
						type:'error'
					})
				}else{
					this.dialog = true
					this.dialogTitle = '修改字典信息'
					let r = this.selectRows[0]
					this.$http({
						url:'/dict/info/info?dictType='+r.dictType+'&dictInfo='+r.dictInfo
					}).then(res=>{
						this.dictform = res.data
					})
				}
			},
			submitForm(){
				let subURL = ''
				if (this.dialogTitle =='新增字典信息'){
					subURL = '/dict/info/add'
				}else{
					subURL = '/dict/info/update'
				}
				this.$http({
					url:subURL,
					method:'POST',
					data:this.dictform
				}).then(res=>{
					this.$message({
						message:res.message,
						type:'success'
					})
					this.dialog = false
					this.getList()
				})
			},
			delet(){
				if(this.selectRows ==0){
					this.$message({
						message:'请至少选择一条删除项'
					})
				}else{
					this.$msgbox({
						message:'确定是否删除?',
						title:'消息',
						showCancelButton:true,
						// type:'warning'
					}).then(()=>{
						this.$http({
							url:'/dict/info/delete',
							method:'POST',
							data:this.selectRowsInfo
						}).then(res=>{
							this.$message({
								message:res.message,
								type:'success'
							})
							this.getList()
						})
					},()=>{})
				}
			}
		}
	}
</script>

<style>
</style>
