commands.push({
    triggers: [
        {
            trigger: "soundcloud",
            help: "soundcloud ............. redirect to " + soundcloudPermUserName + " Soundcloud.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = soundcloudURL;
	}
});