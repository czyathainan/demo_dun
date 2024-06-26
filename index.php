<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>滑动拼图完成验证接口 - 示例</title>
    <!--link href="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_css/net_stcode.css" rel="stylesheet">
    <script src="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_js/net_stcode.js"></script-->
    <link href="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_css/net_stcode_v1.1.css" rel="stylesheet">
    <script src="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_js/net_stcode_v1.1.js"></script>
</head>
<body>
<style type="text/css">
	table tr td{padding:8px;}
</style>

<?php
	$randString	= str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'); //唯一id,不少于35位
?>
<form method="POST" name="testForm" action="." style="width:300px; margin:0 auto;">
	<table>
		<tr>
			<td align="right" width="80">用户名：</td>
			<td>
				<input type="text" name="user_name" />
			</td>
		</tr>
	</table>
	<p>&nbsp; </p>
	
	<input type="hidden" name="stcodeDuplikey" value="<?=$randString;?>" /><!--商户服务器使用该id值做验证-->
	
	<input type="button" value="提 交" class="stcodeBtn" style="display:block; margin:0 auto;" /><!-- class="stcodeBtn"有点击事件监听，不要改名哦 -->
	<a href="javascript:void(0);" onclick="$('.stcodeBtn').click();">点这里也能提交</a>
</form>

<div style="width:300px; margin:0 auto;">
<?php
	//处理客户提交的表单请求
	if(isset($_POST['user_name']))
	{
		$user_name		= $_POST['user_name'];
		$stcodeDuplikey	= $_POST['stcodeDuplikey'];
		
		echo "<p>&nbsp; </p>";
		echo "您输入的内容：".$user_name;
		
		//注意: $stcodeDuplikey 只能使用1次
		$result	= file_get_contents("https://api.jiayyy.com/v1/dun/validate?stcode_duplikey={$stcodeDuplikey}");
		echo "<br />拼图验证结果：".$result;
		$result	= json_decode($result, true);
		if($result['status'] == 1)
		{
			//验证通过, 执行数据库、短信发送等操作...
		}
		else
		{
			echo "拼图验证失败，原因：".$result['message'];
		}
	}
?>
</div>

<script type="text/javascript">
//获取拼图验证码url，支持.jsp .asp .aspx等所有编程语言
var netStCodeUrl	= '/net_stcode.php';

//客户端完成拼图后会触发 stcodeSuccess() 函数
function stcodeSuccess()
{
	if(!document.getElementsByName('user_name')[0].value)
	{
		alert('用户名未输入');
		return false;
	}
	
	alert("恭喜您，验证成功");
	document.testForm.submit();
}
</script>

</body>
</html>
