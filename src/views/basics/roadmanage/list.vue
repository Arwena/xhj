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
		<div style="display: flex; height: 699px;" class="">
			<el-tree :data="regionList" node-key="regionId" ref="tree" show-checkbox="" :props="defaultProps"></el-tree>
			<el-table :data="tableList" border >
				<el-table-column type="index"></el-table-column>
				<!-- <el-table-column type="selection" align="center"></el-table-column> -->
				<el-table-column label="路口别名" prop="crossAlias" width="150"></el-table-column>
				<el-table-column label="路口编号" prop="crossId" width="100"></el-table-column>
				<el-table-column label="路口名称" prop="crossName" width="150"></el-table-column>
				<el-table-column label="路口" prop="feature"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				querykey:'',
				regionList:[],
				defaultProps:{
					children:'children',
					label:'regionName',
					disabled:(d,n)=>{
						if(d.available){
							return false
						}else{
							return true
						}
					}
				},
				tableList:[],
				regionId:''
			}
		},
		mounted(){
			this.initTree()
		},
		methods:{
			getList(){
				console.log("await")
				this.$http({
					url:'/cross/query',
					params:{
						blurry:this.querykey,
						regionId:this.regionId
					}
				}).then(res =>{
					this.tableList = res.data.list
				})
			},
			initTree(){
				this.$http({
					url:'/cross/tree'
				}).then(res =>{
					this.regionList = res.data.tree
					this.regionId = res.data.firstAvailableRegionId
					console.log(this.regionId)
					this.getList()
					// this.$refs.tree.setCheckedKey([])
				})
			},
			keyReset(){
				
			},
			add(){
				
			},
			edit(){
				
			},
			delet(){
				
			}
			
		}
	}
</script>

<style lang="less">
	
	.el-tree{
		width: 250px;
		height: 100%;
		background: none;
		padding: 10px;
		margin-right: 10px;
		margin-top: 30px;
		margin: 30px 10px 0 10px;
		// overflow: scroll;
		background: #024f88;
		color: #fff;
		.el-tree-node__content:hover{
			background-color:#0a4978;
		}
	}
</style>
