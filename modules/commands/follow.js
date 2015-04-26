function follow(trackId, term) {
	if (trackId == 'track') {
		SC.get("/tracks/" + currentTrack['id'], function(track) {
			term.echo("Following " + track.user.username + ".");
			SC.put('/me/followings/' + track.user.id);
			//follow verify is not working yet
			//followVerify();
		});
	} else {
		term.echo("Following " + soundcloudUserName);
		SC.put('/me/followings/' + soundcloudUserId);
		//follow verify is not working yet
		//followVerify();
	}
}