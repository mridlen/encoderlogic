$(function() {
    $('#term').terminal(function(cmd, term) {
        
		//this require loads the functions.js which in turn loads all the command functions (most of the useful code)
		//the commands in the commands directory are now loaded dynamically using the directory_listing.php script
        $.getJSON( "modules/directory_listing.php", function (dir) {
            //debugging
            //console.log(dir);
            for (i = 0; i < dir.length; i++) {
                require(['commands/' + dir[i]]);
            }
			//the command interpreter handles the text input and some basic validation
			require(['interpreter'], function (interpreter) {
				interpretCommand(cmd, term);
			});
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