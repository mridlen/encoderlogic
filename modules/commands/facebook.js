commands.push({
    triggers: [
        {
            trigger: "facebook",
            help: "facebook ............... redirect to " +  soundcloudPermUserName + " Facebook page.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = facebookURL;
	}
});