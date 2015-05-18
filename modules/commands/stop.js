commands.push({
    triggers: [
        {
            trigger: "stop",
            alias: ["s", "st", "sto"],
            help: "stop ................... stop currently playing track and reset the track position to the beginning.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		stopTrack(term);
        currentTrack['trackStatus'] = "stopped";
		currentTrack['trackPosition'] = 0;
	}
});