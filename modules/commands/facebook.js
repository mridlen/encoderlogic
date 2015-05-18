commands.push({
    triggers: [
        {
            trigger: "facebook",
            alias: ["fa", "fac", "face", "faceb", "facebo", "faceboo"],
            help: "facebook ............... redirect to " +  soundcloudPermUserName + " Facebook page.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = facebookURL;
	}
});