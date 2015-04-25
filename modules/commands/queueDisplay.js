function queueDisplay(queue_id, track_id) {
		SC.get("/tracks/" + track_id, function(track) {
			queueStrings[queue_id] = ("[[;"+ theme['quickIdColor'] +";]" + (queue_id + 1) + ")] [[;"+ theme['trackIdColor'] +";]" + track_id + "] - [[;"+ theme['artistIdColor'] +";]" + track.user.username + "] - " + track.title);
			if (showLinks == 1) {
				queueStrings[queue_id] += "\n\tlink: " + track.permalink_url;
			}
			//this is the most sane way to make sure that the entire queue is sent to the output
			//it has to be done within SC.get on the last track
			//I can potentially imagine a situation where one of the SC.get calls does not come back in time though, but it should work *most* of the time
			//not really mission critical for it to display correctly 100% of the time
			if(queue_id == (queue.length - 1)) {
				for (i = 0; i < queue.length; i++) {
					term.echo(queueStrings[i]);
				}
			}
		});
}