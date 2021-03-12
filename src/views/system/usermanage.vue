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
		<el-table :data="usertable" border="" @selection-change="handleSelect">
			<el-table-column type="index"></el-table-column>
			<el-table-column type="selection" align="center"></el-table-column>
			<el-table-column label="用户ID" prop="userId" width="150" align="center"></el-table-column>
			<el-table-column label="用户名称" prop="userName" width="150"></el-table-column>
			<el-table-column label="账号" prop="account" width="150"></el-table-column>
			<el-table-column label="手机" prop="phone" width="150"></el-table-column>
			<el-table-column label="启用状态" prop="status" width="150" align="center">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.status" effect="dark">启用</el-tag>
					<el-tag type="warning" v-else  effect="dark">未启用</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作者" prop="operatorName" width="150"></el-table-column>
			<el-table-column label="操作时间" prop="operateTime" :formatter="initTime"></el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination background layout="prev, pager,next" :total="pager.totalcount" :hide-on-single-page='true' @current-change="pageChange"></el-pagination>
		<el-dialog :title="dialogTitle" :visible.sync="dialog">
			<el-form :model="userform" :inline='true' label-position='center'>
				<el-form-item label="账号" label-width="120px">
					<el-input v-model="userform.account" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名" label-width="120px">
					<el-input v-model="userform.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="120px">
					<el-input v-model="userform.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" label-width="120px">
					<el-input v-model="userform.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="设置角色" label-width="120px">
					<el-select v-model="userform.roleIds" multiple placeholder="请选择角色">
						<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设置区域" label-width="120px">
					<el-tree :data="regionList" node-key="regionId" ref="treeadd" :default-expanded-keys="userform.regionIds" show-checkbox :props="defaultProps"></el-tree>
				</el-form-item>
				<el-form-item label="备注" label-width="120px">
					<el-input type="textarea" v-model="userform.remark"></el-input>
				</el-form-item>
				<el-form-item label="启用状态" class="full-line">
					<el-switch v-model="userform.status"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialog=false">取消</el-button>
				<el-button @click="submitForm()" type="primary">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		
		data(){
			return{
				usertable:[],  //列表展示
				pager:{
					current:'',
					totalcount:0, //分页
					totalpage:''
				},
				querykey:'',         //查询
				dialogTitle:'',      //对话框标题，新增、修改复用
				dialog:false,    //新增
				selectRows:[],      //列表选中
				selectRowsId:[],
				userform:{
					account:'',
					password:'',
					phone:'',
					regionIds:[],
					remark:'',
					roleIds:[],
					status:true,
					userId:'',
					userName:''
				},
				regionList:[],   
				roleList:[],
				defaultProps:{
					children:'children',
					label:'regionName'
				}
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				this.$http({
					url:'/user/query?blurry='+this.querykey
				}).then(res=>{
					this.usertable=res.data.list
					this.pager.totalcount= res.data.totalCount
				})
			},
			initTime(r,c){
				let t = new Date(r.operateTime)
				return t.toLocaleString()
			},
			keyReset(){
				this.querykey = ''
			},
			dialogInit(){
				this.$http({ url:'/role/select'}).then( res => {this.roleList = res.data})
				this.$http({url:'/region/tree'}).then(res =>{
					this.regionList = res.data
					this.$refs.treeadd.setCheckedKeys([])
				})
			},
			userformReset(){
				let user = {
					account:'',
					password:'',
					phone:'',
					regionIds:[],
					remark:'',
					roleIds:[],
					status:true,
					userId:'',
					userName:''
				}
				this.userform = user
			},
			pageChange(val){
				this.$http({
					url:'/user/query?blurry'+this.querykey+'currentPage='+val
				}).then(res =>{
					this.usertable=res.data.list
				})
			},
			handleSelect(val){
				this.selectRows = val
				this.selectRowsId = val.map(function(v,i,ar){return v.userId})
				// console.log(this.selectRowsId)
			},
			add(){
				this.dialogTitle= '新增用户'
				this.dialog = true
				this.dialogInit()
				this.userformReset()
			},
			edit(i){
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
					this.dialogTitle = '修改用户信息'
					this.dialogInit()
					this.dialog = true
					this.$http({
						url:'/user/info?userId='+this.selectRows[0].userId,
						}).then(res=>{
							this.userform = res.data
							this.$refs.treeadd.setCheckedKeys(this.userform.regionIds)
						})
				}
				
			},
			submitForm(){
				this.userform.regionIds = this.$refs.treeadd.getCheckedKeys(true)
				console.log(this.userform.roleIds)
				let subUrl = ''
				if(this.dialogTitle == '新增用户'){
					subUrl = '/user/add'
				}else{
					subUrl = '/user/update'
				}
				this.$http({
					url:subUrl,
					method:'POST',
					data:this.userform
				}).then(res =>{
					//需要更改成功和失败的回调
					this.$message({
						message:res.message,
						type:'success'
					})
				
					this.dialog = false
					this.getList()
				})
			},
			delet(){
				//是否需要删除提示？？
				let val = this.selectRows
				if(val.length == 0){
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
							url:'/user/delete',
							method:'POST',
							data:this.selectRowsId
						}).then(res=>{
							this.$message({
								message:res.message,
								type:'success'
							})
							this.getList()
						})
					} ).catch(()=>{
						
					})
					
				}
				
			}
		}
	}
</script>

<style lang="less">
	
	.el-dialog{
		.full-line{
			position: relative;
			left: -315px;
		}
		
	}
</style>
