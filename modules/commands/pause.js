commands.push({
    triggers: [
        {
            trigger: "pause",
            help: "pause .................. pause current track at its current playing position (use play to resume).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
		pauseTrack(term);
	}
});