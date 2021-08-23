#### 拼图滑块验证码，比传统数字验证码更安全，更方便使用，可用于防暴力破解登录、防短信恶刷、防灌水等场景；

请将 net_stcode.php 文件放到你网站的根目录下，否则验证码图片会无法显示；

本地测试请直接访问 index.php 即可，详细原理见【流程图.png】。

****

1.客户端提交表单到商户服务器后，需要商户服务器使用如下接口验证客户端是否完成拼图验证（注意stcode_duplikey不支持重复验证）: 

```
https://api.jiayyy.com/v1/dun/validate?stcode_duplikey=客户端唯一id
请求方式: GET
响应格式：json
响应示例：{"status":0, "message":"key长度不能少于35位"}
	status	: 取值 0 | 1, 为1表示验证通过
	message	: 错误提示消息
```

****

示例代码是php的，也支持其他编程语言，见示例代码的原理（示例代码很简短，文档就省略了）。
