function like(term) {
	term.echo("Liking current track: " + currentTrack['trackId']);
	SC.put("/me/favorites/" + currentTrack['trackId']);
	
	//this part hasn't been fixed yet
	//SC.get("/user/" + soundcloudUserIdClient + "/favorites/0", function(likes) {
	//		if(likes.id == currentTrack['trackId']) {
	//				term.echo("Current track successfully liked.");
	//		}
	//});
}