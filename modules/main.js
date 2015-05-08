$script(['../terminal/js/jquery-1.7.1.min.js'], 'jquery');
$script(['modules/interpreter.php'], 'interpreter');
$script(['http://connect.soundcloud.com/sdk.js'], 'soundcloud');
$script(['./modules/slowTyping.js'], 'slowTyping');
$script(['./modules/globals.js'], 'globals');

$script.ready(['soundcloud', 'jquery'], function () {
    $script(['./modules/command_functions.php'], 'commands');
});

$script.ready(['jquery'], function () {
    $script(['../terminal/js/jquery.terminal-min.js'], 'jqueryterminal');
});

$script.ready(['jquery', 'jqueryterminal', 'soundcloud'], function () {
    $script(['./modules/soundcloudInitialize.js'], 'soundcloudconnect');
    $script(['./modules/terminal.js'], 'terminal');
});