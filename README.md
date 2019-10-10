拼图滑块验证码，比传统数字验证码更安全，更方便使用，可用于防暴力破解登录、防短信恶刷、防灌水等场景；

请将 dun_puzzle.php 文件放到你网站的根目录下，否则验证码图片会无法显示；

测试请直接访问 index.php 即可。

接口共2个URL，文档省略，见示例代码。

1.获取验证码图片: https://api.jiayuan.com/dun_puzzle.php?stcode_duplikey=客户端唯一id

2.服务器端验证客户端是否完成拼图: https://api.jiayyy.com/v1/dun/validate?stcode_duplikey=客户端唯一id
