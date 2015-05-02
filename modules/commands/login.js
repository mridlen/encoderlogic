function login(term) {
	SC.connect(function() {
		SC.get("/me", function(me){
			if(typeof me.username !== 'undefined') {
				SC.get("/users/" + soundcloudUserId, function(user) {
					//echo the Artist name, and then set the Artist name
					term.echo("Artist: " + user.username);
					soundcloudUserName = user.username;
				});
				//this call sets the oauth_token for the logged in user (needed for accessing the soundcloud stream)
				SC.get("/users/" + soundcloudUserId + "/tracks", {limit: 1, linked_partitioning: 1}, function(tracks) {
					(debugMode) ? console.log("tracks next_href: " + tracks.next_href) : 0;
					(debugMode) ? console.log("split on &: " + tracks.next_href.split("&")[3]) : 0;
					soundcloudOAuthToken = tracks.next_href.split("&")[3];
				});
				//echo the Username, and then set the Username
				term.echo("User: " + me.username);
				soundcloudUserNameClient = me.username;
				soundcloudUserIdClient = me.id;
				
				loggedIn = 1;
				term.set_prompt("[" + soundcloudUserNameClient + "@" + soundcloudUserName + "]>");
			} else {
				term.echo("Not logged in.");
			}
		});
	});
}