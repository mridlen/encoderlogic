commands.push({
    triggers: [
        {
            trigger: "follow",
            help: "follow [track] ......... follow the current artist (default: " + soundcloudPermUserName + ") on Soundcloud. (or use 'follow track' to follow the currently playing track)",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
        function followVerify (term) {
		//this function is not working yet
            SC.get("/users/" + soundcloudUserIdClient + "/followings/" + soundcloudUserId, function(verify, error) {
                if(error) {
                    term.echo("Error: " + error.message);
                } else {
                    term.echo("Current artist " + verify.username + " successfully followed.");
                }
            });
        }
        
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
				//follow verify is not working yet
				//this.followVerify();
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
			//follow verify is not working yet
			//this.followVerify();
		}
	}
});