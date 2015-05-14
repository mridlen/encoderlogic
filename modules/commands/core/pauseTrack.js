function pauseTrack(term) {
	//the amount of time elapsed since the track was played and then stopped
	var timeElapsed = Date.now() - currentTrack['startedTimestamp'];
	
	//add the amount of time elapsed to the current track position
	currentTrack['trackPosition'] = currentTrack['trackPosition'] + timeElapsed;
	
	term.echo("Track paused at " + currentTrack['trackPosition']);
	stopTrack(term);
}