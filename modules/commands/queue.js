commands.push({
    triggers: [
        {
            trigger: "queue",
            alias: ["q", "qu", "que", "queu"],
            help: "queue [help] ........... display the play queue. (search for the track id using the tracks command).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		//queue is exactly like play except that we use the queueTrack instead of playTrack function
		//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(trigger.trigger, cmd.split(" ")[1], cmd.split(" ")[2], term);
	}
});