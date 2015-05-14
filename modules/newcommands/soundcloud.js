commands.push({
    triggers: [
        {
            trigger: "soundcloud",
            help: "soundcloud ............. redirect to " + soundcloudPermUserName + " Soundcloud.",
            requireLoggedIn: false
        }
    ],

	fn: function (term) {
		window.location = soundcloudURL;
	}
});