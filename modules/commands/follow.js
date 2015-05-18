commands.push({
    triggers: [
        {
            trigger: "follow",
            help: "follow [track] ......... follow the current artist (default: " + soundcloudPermUserName + ") on Soundcloud. (or use 'follow track' to follow the currently playing track)",
            requireLoggedIn: true
        },
        {
            trigger: "unfollow",
            help: "unfollow [track] ....... unfollow the current artist (default: " + soundcloudPermUserName + ") on Soundcloud. (or use 'unfollow track' to unfollow the currently playing track)",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
        if (trigger.trigger == 'follow') {
            if (cmd.split(" ")[1] == 'track') {
                (debugMode) ? console.log(currentTrack['trackId']) : 0;
                SC.get("/tracks/" + currentTrack['trackId'], function(track) {
                    (debugMode) ? console.log(track) : 0;
                    
                    SC.put('/me/followings/' + track.user.id, function(error) {
                        if (error.status = "200 - OK") {
                            term.echo("Following " + track.user.username + ".");
                            (debugMode) ? console.log(error) : 0;
                        } else {
                            term.echo("Error in following user. Error object logged to web console.");
                            console.log(error);
                        }
                    });

                });
            } else {
                SC.put('/me/followings/' + soundcloudUserId, function(error) {
                    if (error.status = "200 - OK") {
                        term.echo("Following " + soundcloudUserName + ".");
                        (debugMode) ? console.log(error) : 0;
                    } else {
                        term.echo("Error in following user. Error object logged to web console.")
                        console.log(error);
                    }
                });

            }
        } else if (trigger.trigger == 'unfollow') {
            if (cmd.split(" ")[1] == 'track') {
                (debugMode) ? console.log(currentTrack['trackId']) : 0;
                SC.get("/tracks/" + currentTrack['trackId'], function(track) {
                    (debugMode) ? console.log(track) : 0;
                    
                    SC.delete('/me/followings/' + track.user.id, function(error) {
                        if (error.status = "200 - OK") {
                            term.echo("Unfollowing " + track.user.username + ".");
                            (debugMode) ? console.log(error) : 0;
                        } else {
                            term.echo("Error in unfollowing user. Error object logged to web console.");
                            console.log(error);
                        }
                    });

                });
            } else {
                SC.delete('/me/followings/' + soundcloudUserId, function(error) {
                    if (error.status = "200 - OK") {
                        term.echo("Unfollowing " + soundcloudUserName + ".");
                        (debugMode) ? console.log(error) : 0;
                    } else {
                        term.echo("Error in unfollowing user. Error object logged to web console.")
                        console.log(error);
                    }
                });

            }
        }
	}
});