commands.push({
    triggers: [
        {
            trigger: "play",
            help: "play [help] ............ play a track (search for the track id using the tracks command).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2], term);
	}
});