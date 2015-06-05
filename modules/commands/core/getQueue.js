function getQueue(term) {
    term.echo("");
    term.echo("[[;"+ theme['quickIdColor'] +";]Currently Playing:] [[;"+ theme['trackIdColor'] +";]" + currentTrack['trackId'] + "] - [[;"+ theme['artistIdColor'] +";]" + currentTrack['trackArtist'] + "] - " + currentTrack['trackName']);
	term.echo("=== " + queue.length + " TRACKS QUEUED ===");

    for (queueI = 0; queueI < queue.length; queueI++) {
        queueDisplay(queueI, queue[queueI], term);
    }
	
    term.echo("");
}