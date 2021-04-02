import Mock from 'mockjs'
const url= {
	login:'http://192.168.1.19:8808/auth/login',
	siderbar:'http://192.168.1.19:8808/menu/routing'
}
export default  [
	Mock.mock(url.login,{
		'data|2':{
			'token':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhNmE1NjQzNjNhOTY0ZjAyYjY0MmYzMmM3MDVjN2FjNCIsInN1YiI6IjE6566h55CG5ZGYIiwicGVybSI6IiIsImlzcyI6ImVubzFhIiwiaWF0IjoxNjE3MzMyNjYwLCJhdWQiOiJzaWduYWwtY29udHJvbGxlci11c2VyIiwiZXhwIjoxNjE3MzQ3MDYwfQ.35_hPQMAQev9V64Z0sdTOi1BrlkOfVuMveyZH7ashPgTBlldPyIcs41wQ43YV0PzGgynZBsAnYlaUgozpaMrcA',
			'username':'管理员'
		}
	}),
	Mock.mock(url.siderbar,{
		'data|1':[
			{"menuId":11,"menuName":"信号监控","menuType":0,"icon":"el-icon-s-platform","path":"/monitor","available":true,"children":null},
			{"menuId":12,"menuName":"信号机控制","menuType":0,"icon":"el-icon-s-operation","path":"/signalctrl","available":true,"children":null},
			{"menuId":13,"menuName":"特勤控制","menuType":0,"icon":"el-icon-s-promotion","path":"/specialctrl","available":true,"children":null},
			{"menuId":14,"menuName":"绿波带","menuType":0,"icon":"el-icon-s-unfold","path":"/bandctrl","available":true,"children":null},
			{"menuId":15,"menuName":"基础设置","menuType":0,"icon":"el-icon-menu","path":"","available":true,"children":[{"menuId":1501,"menuName":"路口管理","menuType":1,"icon":null,"path":"/road","available":true,"children":null},{"menuId":1502,"menuName":"信号机管理","menuType":1,"icon":null,"path":"/signalset","available":true,"children":null},{"menuId":1503,"menuName":"特勤管理","menuType":1,"icon":null,"path":"/specialset","available":true,"children":null},{"menuId":1504,"menuName":"绿波带管理","menuType":1,"icon":null,"path":"/bandset","available":true,"children":null}]},
			{"menuId":16,"menuName":"系统设置","menuType":0,"icon":"el-icon-s-tools","path":"","available":true,"children":[{"menuId":1601,"menuName":"用户管理","menuType":1,"icon":null,"path":"/sys/user","available":true,"children":null},{"menuId":1602,"menuName":"角色管理","menuType":1,"icon":null,"path":"/sys/role","available":true,"children":null},{"menuId":1603,"menuName":"区域管理","menuType":1,"icon":null,"path":"/sys/zone","available":true,"children":null},{"menuId":1604,"menuName":"字典管理","menuType":1,"icon":null,"path":"/sys/dictionary","available":true,"children":null},{"menuId":1605,"menuName":"配置管理","menuType":1,"icon":null,"path":"/sys/config","available":true,"children":null},{"menuId":1606,"menuName":"系统日志","menuType":1,"icon":null,"path":"/sys/log","available":true,"children":null}]},
		]
	})
]