<?php

header('Content-type: application/javascript');

$dirname = '/oldcommands';
$files = scandir(dirname(__FILE__) . $dirname);
echo ("//command interpreter\n//built using interpreter.php\n");
echo ("function interpretCommand(cmd, term) {\n\t");
$files2 = array();

foreach ($files as $file) {
	$pathinfovar = pathinfo($file);
	if ($pathinfovar['extension'] == 'cmd') {
		$files2[] = $file;
	}
}

foreach ($files2 as $file) {
    echo( "/* " . $file . " */\n    " );
	include(dirname(__FILE__) . $dirname . "/" . $file);
    if (end($files2) !== $file) {
        echo(" else ");
    }
}

echo ("\n}");
