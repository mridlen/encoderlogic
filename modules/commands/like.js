commands.push({
    triggers: [
        {
            trigger: "like",
            help: "like ................... like the curretly playing track",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
		SC.put("/me/favorites/" + currentTrack['trackId'], function(error) {
            if (error.status = "200 - OK") {
                term.echo("Liked current track: " + currentTrack['trackArtist'] + " - " + currentTrack['trackName']);
                (debugMode) ? console.log(error) : 0;
            } else {
                term.echo("Error liking track. Error object logged to web console.");
                console.log(error);
            }
        });
	}
});