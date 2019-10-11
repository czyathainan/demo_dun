<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>滑动拼图完成验证接口 - 测试</title>
    <link href="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_css/net_stcode.css?v=1.1" rel="stylesheet">
</head>
<body>
<p>&nbsp; </p><p>&nbsp; </p>
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
	
	<input type="hidden" name="stcodeDuplikey" value="<?=$randString;?>" /><!--必须有！！！-->
	
	<input type="button" value="提 交" class="stcodeBtn" style="display:block; margin:0 auto;" />
</form>

<div style="width:300px; margin:0 auto;">
<?php
	if(isset($_POST['user_name']))
	{
		$user_name		= $_POST['user_name'];
		$stcodeDuplikey	= $_POST['stcodeDuplikey'];
		
		echo "<p>&nbsp; </p>";
		echo "您输入的内容：".$user_name;
		
		//注意: $stcodeDuplikey 只能使用1次
		$result	= file_get_contents("https://api.jiayyy.com/v1/dun/validate?stcode_duplikey={$stcodeDuplikey}");
		echo "<br />拼图验证结果：".$result;
		
		if($result == 'ok')
		{
			//执行数据库操作...
			
		}
	}
?>
</div>

<script type="text/javascript">
//获取拼图验证码url
var netStCodeUrl	= '/net_stcode.php';

//拼图成功后会执行 stcodeSuccess() 函数
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
<script src="http://jiayyy.oss-cn-shanghai.aliyuncs.com/common_js/net_stcode.js?v=1.1"></script>

</body>
</html>
