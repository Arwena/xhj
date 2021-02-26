<template>
  <div id="app">
	<router-view/>
  </div>
</template>

<script>
</script>

<style lang="less">
html,body,#app,{
	margin: 0px;
	padding: 0px;
	height: 100%;
	overflow: hidden;
}
h1,h5,p{
	font-weight: normal;
	padding: 0px;
	margin: 0px;
}
a{
	text-decoration: none;
	color: #8a979e;
}
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.f-right{
	float: right;
}
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

</style>
