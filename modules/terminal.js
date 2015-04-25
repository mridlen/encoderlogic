$(function() {
    $('#term').terminal(function(cmd, term) {
        
		//this require loads the functions.js which in turn loads all the command functions (most of the useful code)
		require(['functions'], function (functions) {
			//the command interpreter handles the text input and some basic validation
			require(['interpreter']);
		});
		
		

	},{
        prompt: '[anonymous@Encoder Logic]>',
        greetings: 
            '            >ENCODER LOGIC _   \n\n' +
            '    ++ Official Terminal Server ++\n\n' +
            'Command Interface: version 1.5\n\n' +
            'Type "help" for commands or type "soundcloud" to skip directly to the music.\n' +
            'Type "login" to connect with soundcloud (this enables more commands!)\n\n',
        keypress: function(e) {
        },
        width: 1500,
        height: 768
    });

});