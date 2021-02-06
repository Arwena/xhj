<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-button type="primary" round plain>查询</el-button>
			<el-button type="primary" round plain>重置</el-button>
			<el-button type="primary" round icon="el-icon-circle-plus-outline" style="margin-left: 40px;" @click="addUser">新增</el-button>
			<el-button type="primary" round  icon="el-icon-edit" @click="editUser()">编辑</el-button>
			<el-button type="primary" round icon="el-icon-delete">删除</el-button>
		</div>
		<el-table :data="usertable" border="" >
			<el-table-column type="index"></el-table-column>
			<el-table-column type="selection" align="center"></el-table-column>
			<el-table-column label="用户ID" prop="userId" width="150" align="center"></el-table-column>
			<el-table-column label="客户名称" prop="userName" width="150"></el-table-column>
			<el-table-column label="账号" prop="account" width="150"></el-table-column>
			<el-table-column label="手机" prop="phone" width="150"></el-table-column>
			<el-table-column label="启用状态" prop="status" width="150" >
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.status" effect="dark">启用</el-tag>
					<el-tag type="warning" v-else  effect="dark">未启用</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作者" prop="operatorName" width="150"></el-table-column>
			<el-table-column label="操作时间" prop="operateTime" :formatter="initTime"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				usertable:[],
				querykey:'',
				dialogAdd:false
			}
		},
		mounted(){
			this.getUserList()
		},
		methods:{
			getUserList(){
				this.$http({
					url:'/user/query'
				}).then(res=>{
					this.usertable=res.list
				})
			},
			initTime(r,c){
				let t = new Date(r.operateTime)
				return t.toLocaleString()
			},
			addUser(){
				
			},
			editUser(i){
				
			}
		}
	}
</script>

<style lang="less">
	.topbtn {
		width: 90%;
		margin: 20px auto;
		.el-input{
			width: 30%;
			margin-right:10px ;
			.el-input__inner{
				border-radius:20px
			}
		}
	}
	.el-table{
		width: 90%;
		margin:20px auto;
		// background: rgb(12, 41, 106,0.02);
		background: none;
		color: #fff;
		tr,th{
			background: none;
		}
		tr:hover >td{
			
			background: rgb(0, 28, 71)!important;
		}
	}
</style>
