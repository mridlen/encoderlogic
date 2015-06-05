commands.push({
    triggers: [
        {
            trigger: "next",
            alias: ["n", "ne", "nex"],
            help: "next ................... skip current track and play the next song in the queue",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        if (currentTrack['trackId'] != 0) {
            stopTrack(term);
            currentTrack['trackPosition'] = 0;
            playNextTrack(term);
        } else if (typeof queue[0] != 'undefined') {
            (debugMode) ? console.log("Next command was called, but no track is currently playing. Playing first track in queue.") : 0;
            
            //play the track
            playTrack(queue[0], term);
            
            //remove the first track from the queue
            //remove starting at element 0, remove 1 element (element 0)
            queue.splice(0, 1);
            queueStrings.splice(0, 1);
        }
	}
});