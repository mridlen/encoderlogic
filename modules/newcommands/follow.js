commands.push({
    triggers: [
        {
            trigger: "follow",
            help: "follow [track] ......... follow the current artist (default: " + soundcloudPermUserName +") on Soundcloud. (or use 'follow track' to follow the currently playing track)",
            requireLoggedIn: true
        }
    ],

	fn: function (trackId, term) {
		if (trackId == 'track') {
			SC.get("/tracks/" + currentTrack['id'], function(track) {
				term.echo("Following " + track.user.username + ".");
				SC.put('/me/followings/' + track.user.id);
				//follow verify is not working yet
				//this.followVerify();
			});
		} else {
			term.echo("Following " + soundcloudUserName);
			SC.put('/me/followings/' + soundcloudUserId);
			//follow verify is not working yet
			//this.followVerify();
		}
	}
	
	followVerify: function (term) {
		//this function is not working yet
		SC.get("/users/" + soundcloudUserIdClient + "/followings/" + soundcloudUserId, function(verify, error) {
			if(error) {
				term.echo("Error: " + error.message);
			} else {
				term.echo("Current artist " + verify.username + " successfully followed.");
			}
		});
	}
});