<?php
if (!empty($_SERVER['argv'])) {
	header('Content-type: text/javascript');
	sleep(1);
	echo "document.getElementById('log').innerHTML += 'FILE:&nbsp;&nbsp;&nbsp;\'" . implode(' ', $_SERVER['argv']) .  "\'<br />TIME:&nbsp;&nbsp;&nbsp;' + ((new Date()).getTime() - nTime - 1000) + 'ms<br /><br />'\n";
	echo "nTime = (new Date()).getTime();";
	exit;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

	<title>jQuery.Use</title>
	
</head>

<body>

<div id="log" style="font-family: monospace;"></div>

<script type="text/javascript" charset="utf-8" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script src="jquery.defer.js" type="text/javascript" charset="utf-8"></script>
<script src="jquery.use.js" type="text/javascript" charset="utf-8"></script>
<script src="test.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
	var nTime = (new Date()).getTime();
</script>
</body>
</html>
