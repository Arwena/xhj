<template>
	<div class="login-p">
		<div class="login-content">
			<h1>泸州市泸县智能交通系统一体化调控平台</h1>
			<h5>Integrated control platform of the intelligent transportation system in Luxian,Luzhou</h5>
			<div class="login-box">
				<el-form label-position="top" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="" @keyup.enter.native="submitForm('ruleForm')">
				  <el-form-item label="用户" prop="user">
				    <el-input type="username" v-model="ruleForm.user" auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="密码" prop="pass">
				    <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')" round>提交</el-button>
				    <el-button @click="resetForm('ruleForm')" round>重置</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			var validateUser = (rule, value, callback) => {
				if (value === '') {
				  callback(new Error('请输入用户名'));
				} else {
				  callback();
				}
			  };
			  var validatePass = (rule, value, callback) => {
			  	if (value === '') {
			  	  callback(new Error('请输入密码'));
			  	} else {
			  	  callback();
			  	}
			    };
			return{
				ruleForm: {
				          user: '',
				          pass: '',
				        },
				rules: {
				          user: [
				            { validator: validateUser, trigger: 'blur' }
				          ],
				          pass: [
				            { validator: validatePass, trigger: 'blur' }
				          ]
				        }
				}
		},
		methods:{
			test(){
				this.$http({
					url:'/auth/login',
					method:'post',
					data:{
						"account": this.ruleForm.user,
						"password": this.ruleForm.pass
					}
				}).then(res=>{
					sessionStorage.setItem("token",res.data.token)
					sessionStorage.setItem('acount',res.data.userName)
					// this.$root.token = res.token
					this.$router.push({name: 'Home'})
				})
			},
			submitForm(){
				this.test()
			},
			resetForm(){
				this.ruleForm.user=''
				this.ruleForm.pass=''
			}
		}
	}
</script>

<style lang="less">
	.login-p{
		height: 100%;
		background: url(~@/assets/image/loginbg.png) no-repeat 80% 80%;
		// position: relative;
		.login-content{
			margin: auto;
			padding: 10% 0;
			// position: absolute;
			h1{
				color: #27a8fb;
				font-size: 38px;
				font-weight: normal;
				letter-spacing: 3px;
				margin: 0px;
			}
			h5{
				color: #27a8fb;
				font-size: 18px;
				font-weight: normal;
				
			}
			.login-box{
				background: url(~@/assets/image/lgbox.png) no-repeat;
				width: 668px;
				height: 388px;
				margin:26px auto;
				.el-form{
					padding: 30px 0px;
					width: 64%;
					margin: auto;
					text-align: left;
					label{
						color: #fff;
					}
					.el-input__inner{
						border-radius: 20px;
					}
					.el-form-item__content{
						display: flex;
						justify-content: space-between;
						button{
							width: 200px;
							margin: auto;
						}
					}
				}
				
			}
		}
	}
</style>
