<?php
if (!empty($_GET)) {
	header('Content-type: text/javascript');
	sleep(1);
	echo "document.getElementById('log').innerHTML += 'Loaded: \'" . implode(' ', $_SERVER['argv']) .  "\'<br />'";
	exit;
}?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jQuery.use</title>
</head>
<body>

<div id="log"></div>
	
<script type="text/javascript" charset="utf-8" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script src="jquery.use.js" type="text/javascript" charset="utf-8"></script
<script type="text/javascript" charset="utf-8">
	/**
	 * Set base url
	 */
	// jQuery.use.base = 'http://example.com/jquery/use';
	
	/**
	 * Use a combine file as get args
	 */
	jQuery.use.combine = true;
	
	/**
	 * Setup the modules
	 */
	jQuery.use.modules = {
		'test1'	: { 'path': 'assets/scripts/test1.js' },
		'test2'	: { 'path': 'assets/scripts/test2.js', 'require': 'test1' },
		'test3'	: { 'path': 'assets/scripts/test3.js', 'require': ['test1', 'test2'] },
		'test4'	: { 'path': 'assets/scripts/test4.js' },
		'test5'	: { 'path': 'assets/scripts/test5.js', 'require': ['test4'] }
	};
	
	/**
	 * This should only load the 'test1'
	 */	
	jQuery.use('test1', function($){
		console.log('LOADED: "test1"');
	});
	
	/**
	 * This should only load the 'test2' module, as the 'test1' module should allready be loaded
	 */
	jQuery.use('test2', function($){
		console.log('LOADED: "test2"');
	});
	
	/**
	 * This should fire off as soon the earlier 'test2' use is loaded
	 */
	jQuery.use('test2', function($){
		console.log('LOADED: "test2"');
	});
	
	/**
	 * This should only load the 'test3' module, as 'test1', 'test2' modules should allready be loaded
	 */	
	jQuery.use('test3', function($){
		console.log('LOADED: "test3"');
	});
	
	/**
	 * This should only load both the the 'test4' and 'test5' module, 'test5' requires 'test4'
	 */
	jQuery.use('test5', function($){
		console.log('LOADED: "test5"');
	});
	
	/**
	 * This should fire off as soon as the earlier 'test3' and 'test5' are done
	 */
	jQuery.use(['test3', 'test5'], function($){
		console.log('LOADED: "test3, test5"');
	});
	
	/**
	 * This should fire off directly, uses no modules
	 */
	jQuery.use(function($){
		console.log('LOADED: "none"');
	});
</script>

</body>
</html>
