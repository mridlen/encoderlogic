function playNextTrack () {
	if (queue.length > 0) {
		term.echo("Playing next track.");
		if (queueLoop == 1) {
			//add the current track to the end of queue
			queue.push(currentTrack['trackId']);
		}
		playTrack(queue[0]);

		//remove the track from the queue
		//0 - array element (0 == top of queue)
		//1 - number of elements to remove
		queue.splice(0, 1);
	}
}