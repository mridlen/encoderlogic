commands.push({
    triggers: [
        {
            trigger: "like",
            alias: ["l", "li", "lik", "fav", "favo", "favor", "favori", "favorit", "favorite"],
            help: "like ................... like the currently playing track",
            requireLoggedIn: true
        },
        {
            trigger: "unlike",
            alias: ["unl", "unli", "unlik", "unfav", "unfavo", "unfavor", "unfavori", "unfavorit", "unfavorite"],
            help: "unlike ................. unlike the currently playing track (if you typed like by mistake... idiot)",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
        if(trigger.trigger == "like") {
            SC.put("/me/favorites/" + currentTrack['trackId'], function(error) {
                if (error.status = "200 - OK") {
                    term.echo("Liked current track: " + currentTrack['trackArtist'] + " - " + currentTrack['trackName']);
                    (debugMode) ? console.log(error) : 0;
                } else {
                    term.echo("Error liking track. Error object logged to web console.");
                    console.log(error);
                }
            });
        } else if (trigger.trigger == "unlike") {
            SC.delete("/me/favorites/" + currentTrack['trackId'], function(error) {
                if (error.status = "200 - OK") {
                    term.echo("Liked current track: " + currentTrack['trackArtist'] + " - " + currentTrack['trackName']);
                    (debugMode) ? console.log(error) : 0;
                } else {
                    term.echo("Error unliking track. Error object logged to web console.");
                    console.log(error);
                }
            });
        }
	}
});