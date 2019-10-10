<?php
/**
 * 注意：请将该文件放到你的网站根目录下，否则拼图会无法显示！！！
*/
$t					= isset($_GET['t']) ? $_GET['t'] : '';
$stcode_duplikey	= isset($_GET['stcode_duplikey']) ? $_GET['stcode_duplikey'] : '';
echo file_get_contents("https://api.jiayyy.com/v1/dun/puzzle?t={$t}&stcode_duplikey={$stcode_duplikey}");
