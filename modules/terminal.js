$(function() {
	//this require loads the functions.js which in turn loads all the command functions (most of the useful code)
	//the commands in the commands directory are now loaded dynamically using the directory_listing.php script
    
    $('#term').terminal(function(cmd, term) {
        $script.ready(['core', 'commands', 'interpreter', 'soundcloudconnect'], function () {
            interpretCommand(cmd, term);
        });
    },{
        prompt: '[anonymous@Encoder Logic]>',
        greetings: '',
        keypress: function(e) {
        },
        width: 1500,
        height: 768,
        onInit: function (term) {        

            $script.ready(['environment', 'globals', 'slowTyping'], function () {
                var msg = 
'    ______                     __          __                _     \n' +
'   / ____/___  _________  ____/ /__  _____/ /   ____  ____ _(_)____\n' +
'  / __/ / __ \\/ ___/ __ \\/ __  / _ \\/ ___/ /   / __ \\/ __ `/ / ___/\n' +
' / /___/ / / / /__/ /_/ / /_/ /  __/ /  / /___/ /_/ / /_/ / / /__  \n' +
'/_____/_/ /_/\\___/\\____/\\__,_/\\___/_/  /_____/\\____/\\__, /_/\\___/  \n' +
'      <' + soundcloudURL + '>        /____/          \n\n';
                var msg2 =
				'            >ENCODER LOGIC _\n\n' +
				'    ++ Official Terminal Server ++\n\n';
                
                var msg3 = 
				'Command Interface: version 1.5\n\n' +
				'Type "help" for commands or type "soundcloud" to skip directly to the music.\n' +
				'Type "login" to connect with soundcloud (this enables more commands!)\n\n';
                
                typed_message(term, msg, 1, function () {
                    typed_message(term, msg2, 50, function() {
                        typed_message(term, msg3, 1);
                    });
                });
            });
        }
    });
});