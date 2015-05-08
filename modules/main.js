$script(['modules/zepto.min.js'], 'zepto');
$script(['../terminal/js/jquery-1.7.1.min.js'], 'jquery');
$script(['modules/interpreter.php'], 'interpreter');
$script(['http://connect.soundcloud.com/sdk.js'], 'soundcloud');
$script(['./modules/slowTyping.js'], 'slowTyping');
$script(['./modules/globals.js'], 'globals');

$script.ready(['zepto'], function () {	
	//I think this call is the weak link in the code optimization, since jquery must load first, but I'm willing to sacrifice speed for convenience
	//unless I can come up with a better solution that is just as convenient
	$.getJSON( 'modules/directory_listing.php', function (dir) {
		$script(dir, 'commands');
	});
	
});

$script.ready(['jquery'], function () {
    $script(['../terminal/js/jquery.terminal-min.js'], 'jqueryterminal');
});

$script.ready(['jquery', 'jqueryterminal', 'soundcloud'], function () {
    $script(['./modules/terminal.js'], 'terminal');
});

