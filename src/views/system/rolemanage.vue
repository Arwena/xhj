<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-button type="primary" round plain @click="getRoleList">查询</el-button>
			<el-button type="primary" round plain @click="keyReset">重置</el-button>
			<el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 40px;" @click="add">新增</el-button>
			<el-button type="primary" round  icon="el-icon-edit" @click="edit">编辑</el-button>
			<el-button type="primary" round icon="el-icon-delete" @click="delet">删除</el-button>
		</div>
		<el-table :data="roletable" border @selection-change="handleSelect">
			<el-table-column type="index"></el-table-column>
			<el-table-column type="selection"></el-table-column>
			<el-table-column label="角色ID" prop="roleId" width="200" align="center"></el-table-column>
			<el-table-column label="角色名称" prop="roleName" width="400"></el-table-column>
			<el-table-column label="备注" prop="remark"></el-table-column>
		</el-table>
		<el-dialog :title="dialogTitle" :visible.sync="dialog">
			<el-form :model="roleform" :inline="true" label-position="center">
				<el-form-item label="角色名称" label-width="120px">
					<el-input v-model="roleform.roleName"></el-input>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input v-model="roleform.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog=false">取消</el-button>
				<el-button type="primary" @click="submit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				querykey:'',
				roletable:[],
				dialogTitle:'',
				dialog:false,
				roleform:{
					roleId:'',
					roleName:'',
					remark:''
				},
				selectRows:[],
				selectRowsId:[]
			}
		},
		mounted(){
			this.getRoleList()
		},
		methods:{
			getRoleList(){
				this.$http({
					url:'/role/query?blurry='+this.querykey
				}).then(res =>{
					console.log(res)
					this.roletable = res.list
				})
			},
			keyReset(){
				this.querykey = ''
			},
			handleSelect(val){
				this.selectRows = val
			},
			roleformReset(){
				let role = {
					roleId:'',
					roleName:'',
					remark:''
				}
				this.roleform = role
			},
			add(){
				this.dialogTitle= "新增角色"
				this.roleformReset()
				this.dialog = true
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
					this.dialogTitle = '修改角色信息'
					this.dialog = true
					this.$http({url:'/role/info?roleId='+this.selectRows[0].roleId}).then(res=>{
						this.roleform = res
					})
				}
			},
			submit(){
				let subUrl=''
				if(this.dialogTitle=='新增角色'){
					subUrl = '/role/add'
				}else{
					subUrl = '/role/update'
				}
				this.$http({
					url:subUrl,
					method:'POST',
					data:this.roleform
				}).then(res =>{
					this.$message({
						message:'操作成功',
						type:'success'
					})
					this.dialog =false
					this.getRoleList()
				})
			},
			delet(){
				let arr = this.selectRows
				if(arr.length == 0){
					this.$message({
						message:'请至少选择一条删除项'
					})
				}else{
					for(let i=0;i<arr.length;i++){
						this.selectRowsId.push(arr[i].roleId)
					}
					this.$http({
						url:'/role/delete',
						method:'POST',
						data:this.selectRowsId
					}).then(res =>{
						this.$message({
							message:'操作成功',
							type:'success'
						})
						this.getRoleList()
						this.selectRowsId = []
					})
				}
			}
		}
	}
</script>

<style>
</style>
