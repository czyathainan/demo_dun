拼图滑块验证码，比传统数字验证码更安全，更方便使用，可用于防暴力破解登录、防短信恶刷、防灌水等场景；

请将 dun_puzzle.php 文件放到你网站的根目录下，否则验证码图片会无法显示；

本地测试请直接访问 index.php 即可。
你需要用的只有1个如下URL，文档省略，见示例代码index.php。

1.服务器端验证客户端是否完成拼图（输出yes表示通过）: https://api.jiayyy.com/v1/dun/validate?stcode_duplikey=客户端唯一id
