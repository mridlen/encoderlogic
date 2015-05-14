function queueTrack(track_id, term) {
	if (typeof track_id !== 'undefined') {
		SC.get("/tracks/" + track_id, function (track) {
			term.echo("Adding track to end of queue: " + track.user.username + " - " + track.title + " - link:" + track.permalink_url);
		});
		queue.push(track_id);
	} else {
        (debugMode) ? console.log("Undefined track_id passed to queueTrack") : 0;
    }
}