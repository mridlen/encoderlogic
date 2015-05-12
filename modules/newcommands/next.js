commands.push({
    triggers: [
        {
            trigger: "next",
            help: "next ................... skip current track and play the next song in the queue",
            requireLoggedIn: false
        }
    ],

    fn: function (term) {
		stopTrack(term);
		playNextTrack(term);
	}
});