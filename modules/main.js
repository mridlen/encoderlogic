$script(['../terminal/js/jquery-1.7.1.min.js'], 'jquery');

$script.ready(['jquery'], function () {
    $script(['../terminal/js/jquery.terminal-src.js', 'http://connect.soundcloud.com/sdk.js', './modules/slowTyping.js'], 'bundle');;
});


$script.ready(['bundle'], function () {
    $script(['./modules/globals.js'], 'globals');
    $script('./modules/terminal.js');
});