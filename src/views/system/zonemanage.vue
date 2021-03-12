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
		<el-table max-height="699" :data="regionList" border @selection-change="handleChange" row-key="regionId" :tree-props="{children:'children', hasChildren: 'hasChildren'}">
			<el-table-column type="index"></el-table-column>
			<el-table-column type="selection"></el-table-column>
			<el-table-column label="区域ID" prop="regionId" width="200"></el-table-column>
			<el-table-column label="区域名称" prop="regionName" width="400"></el-table-column>
			<el-table-column label="备注" prop="remark"></el-table-column>
		</el-table>
		<el-pagination background layout="prev,pager,next" :total="pager.totalcount" :hide-on-single-page="true" @current-change="pageChange"></el-pagination>
		<el-dialog :title="dialogTitle" :visible.sync="dialog">
			<el-form :model="zoneform" :inline='true'>
				<el-form-item label="区域ID" label-width="120px">
					<el-input v-model="zoneform.regionId" auto-complete="off" :disabled="idDisable"></el-input>
				</el-form-item>
				<el-form-item label="区域名称" label-width="120px">
					<el-input v-model="zoneform.regionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input  v-model="zoneform.remark"></el-input>
				</el-form-item>
				<el-form-item label="排序序号" label-width="120px">
					<el-input v-model="zoneform.sort" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog=false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				querykey:'',
				regionList:[],
				pager:{
					totalcount:0,
					currentPage:1
				},
				dialogTitle:'',
				dialog:false,
				zoneform:{
					regionId:'',
					regionName:'',
					remark:'',
					sort:''
				},
				selectRows:[],
				selectRowsId:[],
				idDisable:false
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				this.$http({
					url:'/region/query',
					params:{
						blurry:this.querykey,
						currentPage:this.pager.currentPage
					}
				}).then(res =>{
					this.regionList = res.data
				})
			},
			handleChange(val){
				this.selectRows = val
				this.selectRowsId = val.map(function(v,index,arr){return v.regionId})
			},
			pageChange(val){
				this.pager.currentPage = val
				this.getList()
			},
			keyReset(){
				this.querykey = ''
			},
			zoneformReset(){
				let zone = {
					regionId:'',
					regionName:'',
					remark:'',
					sort:''
				}
				this.zoneform = zone
			},
			add(){
				this.dialogTitle="新增区域"
				this.zoneformReset()
				this.dialog = true
				this.idDisable = false
			},
			edit(){
				if(this.selectRows.length == 0){
					this.$message({
						message:'请选择一条修改项',
						type:'warning'
					})
				}else if(this.selectRows.length>1){
					this.$message({
						message:'只能选择一条修改',
						type:'error'
					})
				}else{
					this.dialogTitle="修改区域信息"
					this.dialog = true
					this.idDisable = true
					this.$http({
						url:'/region/info?regionId='+this.selectRows[0].regionId
						}).then(res=>{
							this.zoneform = res.data
						})
				}
				
			},
			submitForm(){
				let subUrl =''
				if(this.dialogTitle == '新增区域'){
					subUrl = '/region/add'
				}else{
					subUrl = '/region/update'
				}
				this.$http({
					url:subUrl,
					method:'POST',
					data:this.zoneform
				}).then(res =>{
					this.dialog = false
					this.$message({
						message:res.message,
						type:'success'
					})
					this.getList()
				})
			},
			delet(){
				//是否需要确认删除
				let arr = this.selectRows
				if(arr.length == 0){
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
							url:'/region/delete',
							method:'POST',
							data:this.selectRowsId
						}).then(res =>{
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
