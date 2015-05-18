commands.push({
    triggers: [
        {
            trigger: "soundcloud",
            alias: ["so", "sou", "soun", "sound", "soundc", "soundcl", "soundclo", "soundclou"],
            help: "soundcloud ............. redirect to " + soundcloudPermUserName + " Soundcloud.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = soundcloudURL;
	}
});