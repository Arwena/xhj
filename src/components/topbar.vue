<template>
	<div class="topbar">
		<h1>泸州市卢县智能交通系统</h1>
		<div class="header-menu f-right">
			<el-menu mode="horizontal" class="f-right">
				<el-menu-item @click="changePsw">
					<i class="el-icon-s-custom"></i>修改密码
				</el-menu-item>
			</el-menu>
		</div>
		<el-dialog title="修改密码" :visible.sync="pswdialog" >
			<el-form :model="pswupdata" label-position="" :inline="true">
				<el-form-item label="账号" class="full-line" label-width="120px">
					<el-tag>{{accountN}}</el-tag>
				</el-form-item>
				<el-form-item label="原密码" label-width="120px">
					<el-input v-model="pswupdata.oldPass"></el-input>
				</el-form-item>
				<el-form-item label="新密码" label-width="120px">
					<el-input v-model="pswupdata.newPass"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="pswdialog = false">取消</el-button>
				<el-button type="primary" @click="updataPsw">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		name:'topbar',
		props:{
			msg:{}
		},
		data(){
			return{
				pswdialog:false,
				pswupdata:{
					oldPass:'',
					newPass:'',
				},
				accountN:''
			}
		},
		methods:{
			changePsw(){
				this.pswdialog = true
				//显示账号可以从session/vuex中保存获取， accountN
				this.accountN = sessionStorage.getItem('acount')
			},
			updataPsw(){
				this.$http({
					url:'/user/pass/update',
					method:'POST',
					data:this.pswupdata
				}).then(res =>{
					// console.log(res)
					this.$message({
						message:res.message
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.topbar{
		background-color: #001029;
		width: 100%;
		height: 60px;
		overflow: hidden;
		// display: flex;
		h1{
			color: #bed1ea;
			font-size: 24px;
			line-height: 60px;
			letter-spacing: 2px;
			display: inline-block;
		}
		.header-menu{
			overflow: hidden;
			.el-menu{
				background:none;
				li:hover,li:focus{
					background: none;
					color: #bed1ea;
					i{
						color: #bed1ea;
					}
				}
			}
		}
		.el-dialog{
			.full-line{
				display: block;
				position: relative;
				left: -336px;
			}
		}
		
	}
</style>
