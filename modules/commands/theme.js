commands.push({
    triggers: [
        {
            trigger: "theme",
            alias: ["th", "the", "them"],
            help: "theme .................. change the theme of text. BETA testing!",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		term.echo("Changing the theme... how bland...");
		
		$('.terminal').css({"background-color": "#FFFFFF"});
		$('.terminal').css({"color": "#000000"});
		$('.cmd').css({"background-color": "#FFFFFF"});
		$('.cmd').css({"color": "#000000"});
		$('body').css({"background-color": "#FFFFFF"});
		$('.cursor').css({"background-color": "#330000"});
		$('.cursor').css({"background": "#330000"});
		$('a').css({"color": "#000000"});
		$('a:visited').css({"color": "#000000"});
		$('a:link').css({"color": "#000000"});
		
		theme = {
			quickIdColor: "black",
			trackIdColor: "black",
			artistIdColor: "black",
			streamableColor: "black",
			streamableTrue: "black",
			streamableFalse: "black"
		}
	}
});