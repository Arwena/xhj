<template>
	<div>
		<!-- 路口设置第一步 -->
		<div class="svg-contain" id="r-setting">
			<input type="checkbox" name="r0" value="r0" style="left: 60px; top: 290px;" v-model="roads"/>
			<div class="road r0"></div>
			<input type="checkbox" value="r180" style="left: 520px; top: 290px;" v-model="roads"/>
			<div class="road r180"></div>
			<input type="checkbox" value="r90" style="top: 60px;left: 290px;" v-model="roads"/>
			<div class="road r90"></div>
			<input type="checkbox" value="r270" style="top: 520px;left: 290px;" v-model="roads"/>
			<div class="road r270" key='r270'></div>
			<input type="checkbox" value="r45" style="left: 125px; top: 125px;" v-model="roads"/>
			<div class="road r45" ></div>
			<input type="checkbox" value="r225" style="left: 455px; top:455px" v-model="roads"/>
			<div class="road r225" ></div>
			<input type="checkbox" value="r135" style="left:455px; top: 125px;" v-model="roads"/>
			<div class="road r135"  ></div>
			<input type="checkbox" value="r315"  style="left: 125px; top:455px;" v-model="roads"/>
			<div class="road r315" ></div>
			<svg height="600" width="600" >
				<!-- <polygon points="204,260 260,204 340,204 396,260 396,340 340,396 260,396 204,340"style="fill:#a8adb7;"/>-->
				<polygon :points="points"
				  style="fill:#a8adb7;"/>	
			</svg>
		</div>
		<div class="topbtn">
			<el-button type="primary" round plain @click="tonext">下一步</el-button>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				widx:154,
				heiy:80,
				r:300,
				x1:'',
				x2:'',
				x3:'',
				x4:'',
				x5:'',
				x6:'',
				x7:'',
				x8:'',
				points:[],
				roads:[],
				// 步骤条
				active:0
			}
		},
		mounted(){
			this.x1 = [this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r+this.heiy/2]
			this.x1 = this.x1.join(',')
			this.x2 =  [this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r-this.heiy/2].join(',')
			this.x3 =  [this.r-this.heiy/2 , this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x4 =  [this.r+this.heiy/2 , this.r-(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x5 =   [this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r-this.heiy/2].join(',')
			this.x6 =   [this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2) ,this.r+this.heiy/2].join(',')
			this.x7 =  [this.r+this.heiy/2 , this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.x8 =  [this.r-this.heiy/2 , this.r+(Math.sin(45 * Math.PI / 180)*this.heiy + this.heiy/2)].join(',')
			this.points = [this.x1,this.x2,this.x3,this.x4,this.x5,this.x6,this.x7,this.x8].join(' ')
		},
		methods:{
			tonext(){
				console.log(this.roads)
				
			}
		}
	}
</script>

<style lang="less">
	// @import url("~@/assets/theme/svgxhj.less");
	@widx:154px;
	@heiy:80px;
	
	@contx:300px;
	@conty:300px;
	 
	 .rotate(@de){
	 		transform: rotate(@de);
	 		-ms-transform:rotate(@de);
	 		-moz-transform:rotate(@de);
	 		-webkit-transform:rotate(@de);
	 		-o-transform:rotate(@de); 
	 }
	 .r(@deg){
	 	.rotate(@deg);
	 	select{
	 		margin: 10px 0px 10px 0px;
	 		.rotate(-@deg)
	 	}
	 }
	 .svg-contain{
	 	// background-color: #eee;
	 	width: @contx*2;
	 	height: @conty*2;
	 	margin:30px auto;
	 	position: relative;
	 }
	 /* 设置路口 */
	 .svg-contain input{
	 	position: absolute;
	 	// top: 200;
	 	// left: 0;
	 	z-index: 2;
	 }
	 .road {
	 	width: @widx;
	 	height: @heiy;
	 	background-color: #a8adb7;
	 	position: absolute;
	 }
	 .r0{
	 	top: @conty - @heiy/2;
	 	left:ceil(@contx - @heiy/2 - @heiy*sin(45deg) - @widx) 
		// left: 50px;
	 }
	 .r45{
	 	top:ceil( @conty - @heiy/2 - (@heiy*sin(45deg))/2 - (@heiy/2 + @widx/2*sin(45deg)));
	 	left:ceil(@contx - @heiy/2- (@heiy*sin(45deg))/2 - (@widx/2 + @widx/2*cos(45deg)));
	 	.r(45deg);
	 }
	 .r90{
	 	top: ceil(@conty - @heiy/2 - @heiy*sin(45deg) - (@heiy/2+@widx/2));
	 	left:ceil(@contx - @widx/2);
	 	.r(90deg)
	 }
	 .r135{
	 	top:ceil( @conty - @heiy/2 - (@heiy*sin(45deg))/2 - (@heiy/2 + @widx/2*sin(45deg)));
	 	left: floor(@contx + @heiy/2+ (@heiy*sin(45deg))/2 - (@widx/2 - @widx/2*cos(45deg)));
	 	.r(135deg)
	 }
	 .r180{
	 	top:  @conty - @heiy/2;
	 	left: floor(@contx + @heiy/2 + @heiy*sin(45deg));
	 	.r(180deg)
	 }
	 .r225{
	 	top:floor( @conty + @heiy/2 + (@heiy*sin(45deg))/2 - (@heiy/2 - @widx/2*sin(45deg)));
	 	left: floor(@contx + @heiy/2+ (@heiy*sin(45deg))/2 - (@widx/2 - @widx/2*cos(45deg)));
	 	.r(225deg)
	 }
	 .r270{
	 	top: floor(@conty + @heiy/2 + @heiy*sin(45deg) - (@heiy/2-@widx/2));
	 	left: ceil(@contx - @widx/2);
	 	.r(270deg)
	 }
	 .r315{
	 	top: floor( @conty + @heiy/2 + (@heiy*sin(45deg))/2 - (@heiy/2 - @widx/2*sin(45deg)));
	 	left: ceil(@contx - @heiy/2- (@heiy*sin(45deg))/2 - (@widx/2 + @widx/2*cos(45deg)));
	 	.r(315deg)
	 }
	 
	 
	 /* 车道设置 */
	 .road-out {
	 	margin-left:32px ;
	 	height: 39px;
	 	width: 120px;
	 	border-bottom:2px solid #d0c060 ;
	 }
	 .road-out img {
	 	display: inline-block;
	 	margin-left: 30px;
	 	margin-top: 15px;
	 }
	 .road-in {
	 	margin-left:32px ;
	 	height: 39px;
	 	width: 120px;
	 	border-right:2px solid #666 ;
	 	
	 }
	 .road-in img {
	 	display: inline-block;
	 	margin-left: 30px;
	 	margin-top: 15px;
	 }
	 
</style>
