commands.push({
    triggers: [
        {
            trigger: "stop",
            help: "stop ................... stop currently playing track and reset the track position to the beginning.",
            requireLoggedIn: false
        }
    ],

	fn: function (cmd, term) {
		stopTrack(term);
		currentTrack['trackPosition'] = 0;
	}
});