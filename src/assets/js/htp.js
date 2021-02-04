import axios from 'axios'
import {Message, MessageBox} from 'element-ui'

const baseurl = process.env.NODE_ENV==='development'?process.env.VUE_APP_URL:'/'

axios.interceptors.response.use(
    response => {
        const res = response.data
		console.log(res)
        if (res && res.status !=200) {
           
			if(res.status ===401){
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
        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

// const http = 
// 	axios.create({
// 		baseURL:baseurl,
// 		timeout:10000,
// 		headers:{
// 			'Content-Type':'application/json;charset=utf-8'
// 		}
// 	})
	
const htpreq = {
	request(opt){
		return new Promise((resolve,reject)=>{
			axios({
				method:opt.method || 'get',
				url: opt.url,
				baseURL:baseurl,
				timeout:10000,
				async:opt.async || true,
				headers:opt.headers || {
					"Content-Type": 'application/json; charset=utf-8',
					// 'Authorization': sessionStorage.getItem('token') || null
				},
				data:opt.data || null
			}).then( response=>{
				let res = response.data
				console.log(res)
				resolve(res.data)
			}).catch(err =>{
				console.log(err)
				if(err =='Error: Request failed with status code 401'){
					MessageBox({
						message:"登录信息已过期，请重新登录",
						type:'error',
						confirmButtonText: '确定',
						callback:action=>{
							this.$router.push({
								name: 'Login'
							})
						}
					})
				}
			})
		})
	}
}
export default htpreq.request