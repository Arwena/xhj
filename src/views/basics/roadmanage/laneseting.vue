<template>
	<div >
		<div class="svg-contain" id="r-setting">
			<div class="road r0"></div>
			<div class="road r180"></div>
			<div class="road r90"></div>
			<div class="road r270" key='r270'></div>
			<div class="road r45" ></div>
			<div class="road r225" ></div>
			<div class="road r135"  ></div>
			<div class="road r315" ></div>
			<svg height="600" width="600" >
				<!-- <polygon points="204,260 260,204 340,204 396,260 396,340 340,396 260,396 204,340"style="fill:#a8adb7;"/>-->
				<polygon :points="points"
				  style="fill:#a8adb7;"/>	
			</svg>
		</div>
	</div>
</template>

<script>
	export default{
		
	}
</script>

<style lang="less">
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
</style>
