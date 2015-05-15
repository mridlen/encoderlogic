//a function to play tracks and work with the queue
function playTrack(track_id, term) {
	//track_id = cmd.split(" ")[1];
	if (!isNaN(track_id)) {
		SC.stream("/tracks/" + track_id, function(sound){
			//output the creator username, title, and url (the url is for AUP reasons, see the soundcloud API AUP)
			//unfortunately due to the nature of this application I am not able to attach an image, but I feel that
			//this application matches the spirit of the policy since I
			//1) give credit to soundcloud
			//2) give credit to the original creator of the music
			//3) link to soundcloud
			//4) don't impersonate soundcloud
			SC.get("/tracks/" + track_id, function(track) {
				term.echo("Now Playing: " + track.user.username + " - " + track.title + "\n\tlink: " + track.permalink_url + " streamable: " + track.streamable);
				
				//assign the current track variables so that we can reference this later
				currentTrack['trackId'] = track.id;
				currentTrack['trackArtist'] = track.user.username;
				currentTrack['trackName'] = track.title;
				currentTrack['trackDuration'] = track.duration;
				currentTrack['startedTimestamp'] = Date.now();
			});
			//stops any currently playing track
			soundManager.stopAll();
			
			(debugMode) ? console.log("Current position: " + currentTrack['trackPosition']) : 0;
			
			//sound already references the track id when the API function is called, so nothing else to supply it but play()
			sound.play({
				position: currentTrack['trackPosition'],
				onfinish: function() {
                    currentTrack['trackPosition'] = 0;
					term.echo("Song finished playing.");
					if (repeat == 0) {
						//play next track in queue
						if (queue.length > 0) {	
							playNextTrack(term);
						}
					} else {
						term.echo("Repeat is on. Playing track from beginning.");
						playTrack(currentTrack['trackId'], term);
					}
				}
			});
			displayTimedComments(track_id, currentTrack['trackPosition'], term);
            currentTrack['trackStatus'] = "playing";
		});
	} else {
		term.echo("Not a valid number.");
	}
}