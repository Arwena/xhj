<template>
	<div class="noth">
		<div class="topbtn">
			<el-input placeholder="请输入查询内容" v-model="querykey" clearable maxlength=300></el-input>
			<el-select placeholder="请选择查看日志类型" v-model="currentUrl">
				<el-option v-for="item in typelist" :key='item.sort' :label="item.typeName" :value="item.typeUrl"></el-option>
			</el-select>
			<el-button type="primary" round plain @click="getList">查询</el-button>
		</div>
		<el-table :data="logtable" border max-height="699">
			<el-table-column type="index"></el-table-column>
			<el-table-column label="ID" prop="logId" width="50" align="center"></el-table-column>
			<el-table-column label="描述" prop="description" ></el-table-column>
			<el-table-column label="执行时间" prop="executionTime" width="250" :formatter="initTime"></el-table-column>
			<el-table-column label="保存时间" prop="operateTime"  width="250"  :formatter="initTime"></el-table-column>
			<el-table-column label="保存人" prop="operatorName" width="150"></el-table-column>
			<el-table-column label="请求IP" prop="requestIp" width="150"></el-table-column>
			<el-table-column label="请求参数" prop="params" align="center">
				<template slot-scope ="scope">
					<el-popover trigger="click" width="300">
						<p>{{scope.row.params}}</p>
						<el-button slot="reference" type="primary" round>查看详情</el-button>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column align="center" v-if="errorIs" label="错误描述" prop="errorDetails" width="200">
				<template slot-scope="scope">
					<el-popover width="600" trigger="click">
						<el-scrollbar style="width: 100%; height: 100%;">
							<p class="foldes">{{scope.row.errorDetails}}</p>
						</el-scrollbar>
						<el-button slot="reference" type="success" round>查看详情</el-button>
					</el-popover>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page.sync="pager.currentPage" :hide-on-single-page="true" :total="pager.totalcount" background layout="prev,pager,next" @current-change="pageChange">
			
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				typelist:[
					{
						typeName:'业务操作日志',
						sort:0,
						typeUrl:'/log/biz/query'
					},
					{
						typeName:'系统操作日志',
						sort:1,
						typeUrl:'/log/sys/query'
					},
					{
						typeName:'信号机日志',
						sort:2,
						typeUrl:'/log/ctrl/query'
					},
					{
						typeName:'错误日志',
						sort:3,
						typeUrl:'/log/error/query'
					}
				],
				currentUrl:'/log/biz/query',
				querykey:'',
				logtable:[],
				pager:{
					totalcount:0,
					currentPage:1
				},
				errorIs:false
			}
		},
		mounted(){
			this.getList()
		},
		methods:{
			getList(){
				// console.log(this.currentUrl)
				if(this.currentUrl =='/log/error/query'){
					this.errorIs = true
				}else{
					this.errorIs = false
				}
				this.$http({
					url:this.currentUrl,
					params:{
						blurry:this.querykey,
						currentPage:1,
						pageSize:10,
					}
				}).then(res =>{
					this.logtable = res.data.list
					this.pager.totalcount = res.data.totalCount
					this.pager.currentPage = res.data.currPage
				})
			},
			initTime(r,c){
				let t = new Date(r.operateTime)
				return t.toLocaleString()
			},
			pageChange(val){
				this.$http({
					url:this.currentUrl,
					params:{
						blurry:this.querykey,
						currentPage:val
					}
				}).then(res=>{
					this.logtable = res.data.list
					// this.pager.currentPage = res.data.currPage
				})
			}
		}
	}
</script>

<style lang="less">
	.el-select{
		margin-right: 10px;
		.el-input{
			width: 100%;
		}
	}
	.el-table{
		.el-scrollbar__wrap {
		        // overflow-x: hidden !important;
		    }
	}
	.foldes{
		height: 200px;
		overflow: scroll;
		
	}
</style>
