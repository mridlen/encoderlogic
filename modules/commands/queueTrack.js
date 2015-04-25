function queueTrack(track_id) {
	if (typeof track_id !== 'undefined') {
		SC.get("/tracks/" + track_id, function (track) {
			term.echo("Adding track to end of queue: " + track.user.username + " - " + track.title + " - link:" + track.permalink_url);
		});
		queue.push(track_id);
	} else {
		term.echo("");
		term.echo("=== " + queue.length + " TRACKS QUEUED ===");
		term.echo("");
		
		
		for (i = 0; i < queue.length; i++) {
			queueDisplay(i, queue[i]);
		}
		
		
		
		term.echo("");
	}
}