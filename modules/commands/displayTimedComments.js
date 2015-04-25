function displayTimedComments(track_id, offset) {
	//uncomment for debugging:
	//term.echo("track_id: " + track_id);
	if (!isNaN(track_id) && !isNaN(offset)) {
		SC.get("/tracks/" + track_id + "/comments", function(comments) {
			for (i = 0; i < comments.length; i++) {
				//the purpose of this offset is to make original comments appear first in the order on screen
				var replyOffset = 0;
				if (comments[i].body.split("@").length < 2) {
					replyOffset = comments[i].timestamp - offset;
				} else {
					replyOffset = comments[i].timestamp - 1 - offset;
				}
				//uncomment for debugging:
				//term.echo(i + " " + replyOffset + " " + comments[i].user.username + " " + comments[i].body);
				if (replyOffset > 0) {
					timedComment (i, replyOffset, comments[i].user.username, comments[i].body);
				}
			}
		});
	} else {
		term.echo ("Not a number.");
	}
}