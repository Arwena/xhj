import axios from 'axios'
import {Message, MessageBox} from 'element-ui'

const baseurl = process.env.NODE_ENV==='development'?process.env.VUE_APP_URL:'/'
//定义一个标志，表示是否已返回失败请求 ，
let er = {
	tokenerr:false,
	neterr:false,
	otherr:false
}

axios.interceptors.response.use(
    response => {
        const res = response.data
        if (res && res.status !=200) {
			if(res.status ===401){
				sessionStorage.setItem('token','')
				MessageBox({
					message:res.message,
					type:'error',
					confirmButtonText: '确定',
					callback:action=>{
						this.$router.push({
							name: 'Login'
						})
					}
				})
			}else{
				Message({
				    message: res.message,
				    type: 'error',
				    duration: 5000
				})
			}
        }else{
			er = {
				tokenerr:false,
				neterr:false,
				otherr:false
			}
		}
		
        return response
    },
    error => {
		if(!er.tokenerr && !er.neterr && !er.otherr){
			return Promise.reject(error)
		}else{
			return Promise.resolve(error)
		}
    }
)
	
const htpreq = {
	request(opt){
		return new Promise((resolve,reject)=>{
			axios({
				method:opt.method || 'get',
				url: opt.url,
				baseURL:baseurl,
				timeout:10000,
				async:opt.async || true,
				params:opt.params ||{},
				headers:opt.headers || {
					"Content-Type": 'application/json; charset=utf-8',
					'Authorization': sessionStorage.getItem('token') || null
				},
				data:opt.data || null
			}).then( response=>{
				if(response.status != 200){
					return
				}else{
					let res = response.data
					if(res.status == 200){
						resolve(res)
					}
				}
			}).catch(err =>{
				if(err =='Error: Request failed with status code 401'){
					er.tokenerr =true
					MessageBox({
						message:"登录信息已过期，请重新登录",
						type:'error',
						confirmButtonText: '确定',
						callback:action=>{
							sessionStorage.setItem("token",'')
							// 通过状态保存当前from页面，登录后自动跳转
							this.$router.push({
								name: 'Login'
							})
						}
					})
				}else if(err == 'Error: Network Error'){
					er.neterr = true
					Message({
						message:err.message,
						type:'error'
					})
				}else{
					// console.log("403是未授权被禁止，跳转到首页")
					er.otherr = true
					MessageBox({
						message:err.message,
						type:'error',
						confirmButtonText:'确定',
						callback:action =>{
							this.$router.push({
								name: 'First'
							})
						}
					})
				}
			})
		})
	}
}
export default htpreq.request