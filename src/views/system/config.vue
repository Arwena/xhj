<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-button type="primary" round plain @click="getList">查询</el-button>
			<el-button type="primary" round plain @click="keyReset">重置</el-button>
			<!-- <el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 40px;" @click="add">新增</el-button> -->
			<el-button type="primary" round icon="el-icon-edit" @click="edit">编辑</el-button>
			<!-- <el-button type="primary" round icon="el-icon-delete" @click="delet">删除</el-button> -->
		</div>
		<el-table :data="configList" border @current-change="handleChange" highlight-current-row="">
			<el-table-column type="index"></el-table-column>
			<!-- <el-table-column type="selection"></el-table-column> -->
			<el-table-column label="参数名" prop="configKey" width="300"></el-table-column>
			<el-table-column label="参数值" prop="configValue" width="300"></el-table-column>
			<el-table-column label="备注" prop="remark"></el-table-column>
		</el-table>
		<el-pagination background layout="prev,pager,next" :total="pager.totalcount" :hide-on-single-page="true" @current-change="currChange"></el-pagination>
		<el-dialog title="修改参数" :visible.sync="dialog">
			<el-form :model="configform" inline>
				<el-form-item label="参数名" label-width="120px" >
					<el-input v-model="configform.configKey" disabled=""></el-input>
				</el-form-item>
				<el-form-item label="参数值" label-width="120px">
					<el-input v-model="configform.configValue"></el-input>
				</el-form-item>
			</el-form>
			<div class="el-footer" slot="footer">
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
				configList:[],
				querykey:'',
				configform:{
					configKey:'',
					configValue:'',
					
				},
				pager:{
					totalcount:0,
					currentPage:1
				},
				dialog:false,
				selectRow:{}
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				this.$http({
					url:'/config/query',
					params:{
						blurry:this.querykey,
						currentPage:this.pager.currentPage,
						pageSize:10
					}
				}).then(res=>{
					this.configList = res.data.list
				})
			},
			keyReset(){
				this.querykey = ''
			},
			handleChange(val){
				this.configform = val
			},
			currChange(val){
				this.pager.currentPage = val
				this.getList()
			},
			edit(){
				if(this.configform.configKey != ''){
					this.dialog = true
				}else{
					this.$message({
						message:'请先选择一条记录',
						type:'warning'
					})
				}
			},
			submitForm(){
				this.$http({
					url:'/config/update',
					method:'POST',
					data:this.configform
				}).then(res=>{
					this.$message({
						message:res.message,
						type:'success'
					})
					this.dialog = false
				})
			}
		}
	}
</script>

<style>
</style>
