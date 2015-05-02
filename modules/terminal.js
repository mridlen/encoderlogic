$(function() {
	//this require loads the functions.js which in turn loads all the command functions (most of the useful code)
	//the commands in the commands directory are now loaded dynamically using the directory_listing.php script
    $.getJSON( "modules/directory_listing.php", function (dir) {
		$('#term').terminal(function(cmd, term) {

			interpretCommand(cmd, term);

		},{
			prompt: '[anonymous@Encoder Logic]>',
			greetings: '',
			keypress: function(e) {
			},
			width: 1500,
			height: 768,
			onInit: function (term) {
				//term.pause() will keep the terminal paused until all the requires are loaded
				//this keeps the user from seeing any unsightly errors that may occur if too quick of a typist
				//or too slow of an internet connection
				term.pause();

				//this loads the commands that were loaded in the directory_listing.php
				for (i = 0; i < dir.length; i++) {
					require(['commands/' + dir[i]]);
				}
				
				//the command interpreter handles the text input and some basic validation
				require(['interpreter'], function (interpreter) {
					term.resume();
				});
				
				var msg = 
'    ______                     __          __                _     \n' +
'   / ____/___  _________  ____/ /__  _____/ /   ____  ____ _(_)____\n' +
'  / __/ / __ \\/ ___/ __ \\/ __  / _ \\/ ___/ /   / __ \\/ __ `/ / ___/\n' +
' / /___/ / / / /__/ /_/ / /_/ /  __/ /  / /___/ /_/ / /_/ / / /__  \n' +
'/_____/_/ /_/\\___/\\____/\\__,_/\\___/_/  /_____/\\____/\\__, /_/\\___/  \n' +
'                                                   /____/          \n' +
				'            >ENCODER LOGIC _            <' + soundcloudURL + '>\n\n' +
				'    ++ Official Terminal Server ++\n\n' +
				'Command Interface: version 1.5\n\n' +
				'Type "help" for commands or type "soundcloud" to skip directly to the music.\n' +
				'Type "login" to connect with soundcloud (this enables more commands!)\n\n';
				typed_message(term, msg, 15);
			}
		});
	});

});