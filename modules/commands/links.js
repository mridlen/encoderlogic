commands.push({
    triggers: [
        {
            trigger: "links",
            help: "links [on|off] ......... turn on or off links from the tracks and queue commands. (Doubles page size.)",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
        function turnLinksOn (term) {
            showLinks = 1;
            page_size = 20;
            term.echo("Links: on");
        }
        function turnLinksOff (term) {
            showLinks = 0;
            page_size = 40;
            term.echo("Links: off");
        }
        arg1 = cmd.split(" ")[1];
		if (arg1 == 'off') {
			term.echo('\nDisclaimer: turning off links may break the Soundcloud terms of usage (attribution iii). \n' +
							 'See: https://developers.soundcloud.com/docs/api/terms-of-use#branding \n' +
							 'This option does not turn off all links, but it is intended to improve readability of tracks and queue commands. \n' +
							 'By turning links off you acknowledge this and absolve the website developer of any responsibility.' +
							 'You may turn links back on using the "links on" command. \n\n');
			term.push(function(confirmationPrompt) {
				if (confirmationPrompt.match(/y|yes/i)) {
					turnLinksOff(term);
					term.pop();
				} else if (confirmationPrompt.match(/n|no/i)) {
					turnLinksOn(term);
					term.pop();
				}
			}, {
				prompt: 'Are you sure that you wish to continue? (y/n): ', 
			});
		} else if (arg1 == 'on') {
			showLinks = 1;
			term.echo("Links: on");
		} else {
			if (showLinks == 0) {
				term.echo("Links: off");
			} else if (showLinks == 1) {
				term.echo("Links: on");
			}
		}
	}
});