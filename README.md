#### 【滑动拼图验证码】拼图滑块验证码，比传统数字验证码更安全，更方便使用，可用于防暴力破解登录、防短信恶刷、防灌水等场景；

请将 net_stcode.php 文件放到你网站的根目录下，否则验证码图片会无法显示；

本地测试请运行访问 index.php 即可，原理见【流程图.png】。

****

1.客户端提交表单到商户服务器后，需要商户服务器使用如下接口二次验证客户端提交是否合法请求（注意stcode_duplikey不支持重复验证）: 

```
https://api.jiayyy.com/v1/dun/validate?stcode_duplikey=客户端唯一id
请求方式: GET
响应格式：json
响应示例：{"status":0, "message":"key长度不能少于35位"}
	status	: 取值 0 | 1, 为1表示验证通过
	message	: 错误提示消息
```

****

如果你需要使用 ES6 语言标准，请使用 net_stcode_es6_v1.1.js, 以下以 VUE3 代码为例：
```
视图组件 LoginView.vue
<template>
	<form>
		<div>
			用户名：<input type="text" v-model.trim="user_name" />
		</div>
		<div>
			密  码：<input type="password" v-model.trim="user_pwd" />
		</div>
		<div>
			<input type="hidden" name="stcodeDuplikey" :value="stcodeRandString" />
			<button type="button" ref="stcodeBtn" class="stcodeBtn hide">Login</button> <!--class="stcodeBtn"必须存在-->
			
			<button type="button" @click="userLogin">提 交</button>
		</div>
	</form>
</template>

<script>
import stcode from '@/../public/js/net_stcode_es6_v1.1.js'

export default {
	data(){
		return {
			user_name:'', 
			user_pwd:'', 
			stcodeRandString: ''
		}
	}
	,mounted(){
		stcode.init()
		stcode.netStCodeImgUrl	= '/v1/dun/net-stcode'	//拼图路径, 你需要将 net_stcode.php 重命名为 index.php 后放置到 /public/v1/dun/ 下
		stcode.stcodeSuccess = function(){				//客户端拼图成功会触发该函数
			alert('拼图验证成功，发送网络请求验证用户名和密码...')
			console.log('发送网络请求验证用户名和密码')
			axios({
				method: 'POST', 
				url: 'http://你的域名地址/check-login.php', 
				data: {
						uid: this.user_name, 
						password: this.user_pwd, 
						stcodeDuplikey: this.stcodeRandString	//服务器端用该参数发送网络请求做二次验证，如果二次验证通过则检验用户名和密码
					}
			})
			.then(res => {
				console.log('POST请求成功 ',res)
				
				//这里放置你的业务代码。。。
				
			})
		}
		this.stcodeRandString	= stcode.getRandString(25)	//随机字符串，可自定义，服务器端使用该id进行二次验证
	}
	,methods:{
		userLogin(){
			this.$refs.stcodeBtn.click()
		}
	}
}
</script>

<style scoped>
@import 'https://jiayyy.oss-cn-shanghai.aliyuncs.com/common_css/net_stcode_v1.1.css?v=1.0';

.red{color:#ff0000;}
.hide{display:none;}
</style>
```


此外你需要改下 vue.config.js , 配置代理解决跨域图片无法绘制的问题, 示例如下：
```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, 
  devServer: {
    proxy: {
      //解决canvas绘图无法操作跨域图片的问题
      '/v1/dun/net-stcode': {
        target: 'https://api.jiayyy.com', //目标跨域服务器, 客户端请求“/v1/dun/net-stcode”会转到“https://api.jiayyy.com/v1/dun/net-stcode”
        changeOrigin: true
      }
    }
  }
})
```


获取图片示例代码是php的，也支持其他编程语言，见示例代码的原理（示例代码很简短，文档就省略了）。
