<?php

header('Content-type: application/javascript');

$dirname = '/commands/core';
$files = scandir(dirname(__FILE__) . $dirname);
echo ("//command functions, built using command_core.php\n\n");

$files2 = array();

foreach ($files as $file) {
	$pathinfovar = pathinfo($file);
	if ($pathinfovar['extension'] == 'js') {
		$files2[] = $file;
	}
}

foreach ($files2 as $file) {
    echo( "/* " . $file . " */\n\n" );
	include(dirname(__FILE__) . $dirname . "/" . $file);
    echo("\n\n");
}
