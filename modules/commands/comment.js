function comment(cmd) {
	if(cmd.split(" ").length == 1 || cmd.split(" ")[1] == "help") {
		term.echo("");
		term.echo("syntax:");
		term.echo("comment This track is awesome!!");
		term.echo("Note: do not enclose your comment in quotes unless you are quoting somebody or for purposes of irony");
		term.echo("");
	} else if (currentTrack['trackId'] != 0) {
		term.echo("comment: " + cmd.substring(8));
		commentTimestamp = parseInt(Date.now() - currentTrack['startedTimestamp']);
		postUrl = String('/tracks/' + currentTrack['trackId'] + '/comments');
		bodyString = String(cmd.substring(8));
		
		term.echo("commentTimestamp: " + commentTimestamp);
		term.echo("postUrl: " + postUrl);
		term.echo("bodyString: " + bodyString);
		SC.post(postUrl, {
			comment: {
				body: bodyString,
				timestamp: commentTimestamp
			}},
			function(comment, error) {
				if(error) {
					term.echo("Error: " + error.message);
				}
			}
		);
	}
}