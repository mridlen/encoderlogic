function getQueue(term) {
    term.echo("");
    term.echo("[[;"+ theme['quickIdColor'] +";]Currently Playing:] [[;"+ theme['trackIdColor'] +";]" + currentTrack['trackId'] + "] - [[;"+ theme['artistIdColor'] +";]" + currentTrack['trackArtist'] + "] - " + currentTrack['trackName']);
	term.echo("=== " + queue.length + " TRACKS QUEUED ===");

    for (i = 0; i < queue.length; i++) {
        queueDisplay(i, queue[i], term);
    }
	
    term.echo("");
}