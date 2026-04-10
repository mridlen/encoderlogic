//command functions, built using command_core.php (static bundle)

/* displayTimedComments.js */

function displayTimedComments(track_id, offset, term) {
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
					timedComment (i, replyOffset, comments[i].user.username, comments[i].body, term);
				}
			}
		});
	} else {
		term.echo ("Not a number.");
	}
}

/* formatTracks.js */

function formatTracks(theListOfTracks, term) {
	(debugMode) ? console.log(theListOfTracks) : 0;
	//output the header
	term.echo("[[;"+ theme['quickIdColor'] +";]Quick Play ID] [[;"+ theme['trackIdColor'] +";]Track ID] [[;"+ theme['artistIdColor'] +";]Artist] Track");
	
	//output the list of tracks
	for (i = 0; i < page_size; i++) {
        //without this check (i < theListOfTracks.length), the script will throw the following error and not display any tracks
        //Uncaught TypeError: Cannot read property 'id' of undefined
        if (i < theListOfTracks.length) {
            streamable = "";
            if (theListOfTracks[i].streamable == true) {
                streamable = "[[;" + theme['streamableTrue'] + ";]true]";
            } else {
                streamable = "[[;" + theme['streamableFalse'] + ";]false]";
            }
            term.echo("[[;"+ theme['quickIdColor'] +";]" + (i+1) + ")] [[;"+ theme['trackIdColor'] +";]" + theListOfTracks[i].id + "] - [[;"+ theme['artistIdColor'] +";]" + theListOfTracks[i].username  + "] - " + theListOfTracks[i].title + " - [[;" + theme['streamableColor'] + ";]streamable:] " + streamable );
            
            (showLinks) ? term.echo('\tlink:' + theListOfTracks[i].permalink_url) : 0;
            
            searchTracks[i] = theListOfTracks[i].id;
        }
	}
    (helpMode) ? term.echo('Type "more" to display more tracks') : 0;
}

/* getNextHref.js */

function getNextHref(next_href, term) {
	 //load the next_href
	if (moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") { // i.e. stream
		//uncomment for debugging
		//term.echo(tracks.next_href + "&" + soundcloudOAuthToken);
		
		moreArray['nextPageURL'] = next_href + "&" + soundcloudOAuthToken;
		(debugMode) ? console.log("nextPageURL " + moreArray['nextPageURL']) : 0;
	} else {
		moreArray['nextPageURL'] = next_href;
		(debugMode) ? console.log("nextPageURL " + moreArray['nextPageURL']) : 0;
	}
	
	//add +1 to the pagination in case "more" is used
	moreArray['page']++;
}

/* getQueue.js */

function getQueue(term) {
    term.echo("");
    term.echo("[[;"+ theme['quickIdColor'] +";]Currently Playing:] [[;"+ theme['trackIdColor'] +";]" + currentTrack['trackId'] + "] - [[;"+ theme['artistIdColor'] +";]" + currentTrack['trackArtist'] + "] - " + currentTrack['trackName']);
	term.echo("=== " + queue.length + " TRACKS QUEUED ===");

    for (queueI = 0; queueI < queue.length; queueI++) {
        queueDisplay(queueI, queue[queueI], term);
    }
	
    term.echo("");
}

/* listTracks.js */

function listTracks(arg0, term) {
	//clear searchTracks[]
	searchTracks = [];
	
	//first we need to split depending on if tracks/search or more is used
	//we will be dumping the list of tracks into theListOfTracks
	if (arg0 != 'more') { //arg0 == 'stream' || arg0 == 'tracks'
		if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
			listTracksStream(term);
		} else {
			listTracksTracks(term);
		}
	} else { //arg0 == 'more'
	//the only reason we care if arg0 == 'more' is because we have use a different method to query the API
		if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
			moreTracksStream(term);
		} else {
			moreTracksTracks(term);
		}
	}
}

/* listTracksStream.js */

function listTracksStream(term) {
	var theListOfTracks = [];
	SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
		for (i = 0; i < page_size; i++) {
            //without this check (i < tracks.length), the script will throw the following error and not display any tracks
            //Uncaught TypeError: Cannot read property 'id' of undefined
            if (i < tracks.collection.length) {
                theListOfTracks[i] = {
                    id: tracks.collection[i].origin.id,
                    username: tracks.collection[i].origin.user.username,
                    title: tracks.collection[i].origin.title,
                    permalink_url: tracks.collection[i].origin.permalink_url,
                    streamable: tracks.collection[i].origin.streamable
                };
            }
		}
		formatTracks(theListOfTracks, term);
		getNextHref(tracks.next_href, term);
	});
}

/* listTracksTracks.js */

function listTracksTracks(term) {
	var theListOfTracks = [];
	SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
        (debugMode) ? console.log(tracks) : 0;
		for (i = 0; i < page_size; i++) {
            //without this check (i < tracks.length), the script will throw the following error and not display any tracks
            //Uncaught TypeError: Cannot read property 'id' of undefined
            if (i < tracks.collection.length) {
                theListOfTracks[i] = {
                    id: tracks.collection[i].id,
                    username: tracks.collection[i].user.username,
                    title: tracks.collection[i].title,
                    permalink_url: tracks.collection[i].permalink_url,
                    streamable: tracks.collection[i].streamable
                };
            }
		}
        (debugMode) ? console.log(theListOfTracks) : 0;
		formatTracks(theListOfTracks, term);
		getNextHref(tracks.next_href, term);
	});
}

/* moreTracksStream.js */

function moreTracksStream(term) {
	var theListOfTracks = [];
	$.getJSON(moreArray['nextPageURL'], function( tracks ) {
		for (i = 0; i < page_size; i++) {
            //without this check (i < tracks.length), the script will throw the following error and not display any tracks
            //Uncaught TypeError: Cannot read property 'id' of undefined
            if (i < tracks.collection.length) {
                theListOfTracks[i] = {
                    id: tracks.collection[i].origin.id,
                    username: tracks.collection[i].origin.user.username,
                    title: tracks.collection[i].origin.title,
                    permalink_url: tracks.collection[i].origin.permalink_url,
                    streamable: tracks.collection[i].origin.streamable
                };
            }
		}
		formatTracks(theListOfTracks, term);
		getNextHref(tracks.next_href, term);
	});
}

/* moreTracksTracks.js */

function moreTracksTracks(term) {
	var theListOfTracks = [];
	$.getJSON(moreArray['nextPageURL'], function( tracks ) {
		for (i = 0; i < page_size; i++) {
            //without this check (i < tracks.length), the script will throw the following error and not display any tracks
            //Uncaught TypeError: Cannot read property 'id' of undefined
            if (i < tracks.collection.length) {
                theListOfTracks[i] = {
                    id: tracks.collection[i].id,
                    username: tracks.collection[i].user.username,
                    title: tracks.collection[i].title,
                    permalink_url: tracks.collection[i].permalink_url,
                    streamable: tracks.collection[i].streamable
                };
            }
		}
		formatTracks(theListOfTracks, term);
		getNextHref(tracks.next_href, term);
	});
}

/* pauseTrack.js */

function pauseTrack(term) {
	//the amount of time elapsed since the track was played and then stopped
	var timeElapsed = Date.now() - currentTrack['startedTimestamp'];
	
	//add the amount of time elapsed to the current track position
	currentTrack['trackPosition'] = currentTrack['trackPosition'] + timeElapsed;
	
	term.echo("Track paused at " + currentTrack['trackPosition']);
	stopTrack(term);
    
    currentTrack['trackStatus'] = "paused";
}

/* playNextTrack.js */

function playNextTrack (term) {
	if (queue.length > 0) {
		term.echo("Playing next track.");
		if (queueLoop == 1) {
			//add the current track to the end of queue
			queue.push(currentTrack['trackId']);
		}
		playTrack(queue[0], term);

		//remove the track from the queue
		//0 - array element (0 == top of queue)
		//1 - number of elements to remove
		queue.splice(0, 1);
	}
}

/* playOrQueue.js */

function playOrQueue(arg0, arg1, arg2, term) {
    (debugMode) ? console.log("PlayOrQueue arguments: " + arg0 + " " + arg1 + " " + arg2) : 0;
	if (arg0 == 'queue' && arg1 == 'clear') {
		//"queue clear" command...
		//clear out the queue array
		queue = [];
		
		//exit the function early
		return;
	}
	if (arg0 == 'queue' && arg1 == 'remove' && !isNaN(arg2)) {
		//remove the track from the queue, arg2 holds the queue id
		//subtract 1 because array starts at 0, remove 1 element
		queue.splice((arg2 - 1), 1);
		queueStrings.splice((arg2 - 1), 1);
		//exit the function early
		return;
	}
	if (arg0 == 'queue' && arg1 == 'loop') {
		if (arg2 == 0 || arg2 == 'off') {
			queueLoop = 0;
			term.echo("Queue Loop: off");
		} else if (arg2 == 1 || arg2 == 'on') {
			queueLoop = 1;
			term.echo("Queue Loop: on");
		} else {
			if (queueLoop == 0) {
				term.echo("Queue Loop: off");
			} else if (queueLoop == 1) {
				term.echo("Queue Loop: on");
			}
		}
		//exit the function early
		return;
	}			
	if (arg1 == 'help') {
		term.echo("");
		term.echo("You can use the '" + arg0 + "' command a couple of different ways");
		term.echo("First use the tracks command to search for the track you want to  " + arg0 + " .");
		term.echo("example output:");
		term.echo("1) 197946816 - Encoder Logic - Cloudpusher V0");
		term.echo("'1' is the quick play id and '197946816' is the track id");
		term.echo("");
		term.echo("Supplying a track id:");
		term.echo("\t" + arg0 + " 103143977");
		term.echo("Supplying a quick play id:");
		term.echo("\t" + arg0 + " 2");
		term.echo("Force a track id to be used instead of a quick play id:");
		term.echo("\t" + arg0 + " id 2");
		term.echo("(Try it! That " + arg0 + "s the oldest soundcloud track)");
		//there are more ways to use the queue command vs the play command
		if (arg0 == 'queue') {
			term.echo("Clear the " + arg0 + ":");
			term.echo("\t" + arg0 + " clear");
			term.echo("Remove a track from the " + arg0 + ":");
			term.echo("\t" + arg0 + " remove 2");
			term.echo("Turn on "+ arg0 + " looping:");
			term.echo("\t" + arg0 + " loop on");
			term.echo("\tor");
			term.echo("\t" + arg0 + " loop 1");
			term.echo("Turn off "+ arg0 + " looping (endless playlist looping):");
			term.echo("\t" + arg0 + " loop off");
			term.echo("\tor");
			term.echo("\t" + arg0 + " loop 0");
		}
		term.echo("");
		term.echo("Note:");
		term.echo("You cannot use the quick play option if you have not used the 'tracks' command first");
		term.echo("");
	} else if (arg1 == 'id' && typeof arg2 !== 'undefined') {
		//if "track id <id>" is specified, then play the track id
		//otherwise we will use the quick play id
		if(arg0 == 'play') {
			playTrack(arg2, term);
		} else if (arg0 == 'queue') {
			queueTrack(arg2, term);
		}
    } else if (arg1 == 'all') {
        if (arg0 == 'play') {
            //play the first track
            playTrack(searchTracks[0], term);
            
            //queue the rest of the tracks
            for (i = 1; i < page_size; i++) {
                if (i < searchTracks.length) {
                    queueTrack(searchTracks[i], term);
                }
            }
        } else if (arg0 == 'queue') {
            //queue the list of tracks
            for (i = 0; i < page_size; i++) {
                if (i < searchTracks.length) {
                    queueTrack(searchTracks[i], term);
                }
            }
        }
	} else if (typeof arg1 !== 'undefined') {
		(debugMode) ? console.log("Arg1 not empty. Using quick play ID. Command: " + arg0) : 0;
		//our safe zone will be 1-trackLimit for quick play numbers (I eventually plan to move this to a variable that can be easily adjusted)
		//you will be able to supply a track id using syntax "play id <track id>"
		if(arg1 < trackLimit) {
			//play the quick play number
			(debugMode) ? console.log("quick play id supplied: " + (arg1)) : 0;
			
			if(arg0 == 'play') {
				playTrack(searchTracks[(arg1 - 1)], term);
			} else if (arg0 == 'queue') {
				queueTrack(searchTracks[(arg1 - 1)], term);
			}
			
		} else {
			term.echo("1-" + trackLimit + " range exceeded, playing track id instead");
			//play the track id if out of the 1-trackLimit safety range
			if(arg0 == 'play') {
				playTrack(arg1, term);
			} else if (arg0 == 'queue') {
				queueTrack(arg1, term);
			}
		}
	} else if (typeof arg1 === 'undefined') {
        (debugMode) ? console.log("Arg1 undefined. Either Playing stopped track or displaying the queue, depending on Arg0: " + arg0) : 0;
			//if this is play, we want to play the stopped track
			if (arg0 == 'play' && currentTrack['trackId'] !== 0) {
                (debugMode) ? console.log("Arg1 undefined, arg0 = play") : 0;
                if (currentTrack['trackStatus'] == "stopped") {
                    term.echo("Playing previously stopped track from beginning.");
                } else if (currentTrack['trackStatus'] == "paused") {
                    term.echo("Resuming previously paused track.");
                }
				(debugMode) ? console.log("currentTrack['trackId'] == " + currentTrack['trackId']) : 0;
				playTrack(currentTrack['trackId'], term);
            } else if (arg0 == 'play' && currentTrack['trackId'] == 0 && typeof queue[0] != 'undefined') {
                //play with no arguments
                //there is no currently playing track
                //there is at least one track in the queue
                (debugMode) ? console.log("Play has no arguments. There is no currently playing track. There is at least one track in the queue. Playing first track in queue.") : 0;
                
                //play the track
                playTrack(queue[0], term);
                
                //remove the first track from the queue
                //remove starting at element 0, remove 1 element (element 0)
                queue.splice(0, 1);
                queueStrings.splice(0, 1);
			} else if (arg0 == 'queue') {
                (debugMode) ? console.log("Arg1 undefined, arg0 = queue") : 0;
				//this will display the queue
				getQueue(term);
			}
		
	}
}

/* playTrack.js */

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
				term.echo("Description:");
                term.echo(track.description);

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

            //if someone skipped back too far in the track, this will start it from the beginning...
			if (currentTrack['trackPosition'] < 0) {
                currentTrack['trackPosition'] = 0;
            }

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

/* queueDisplay.js */

function queueDisplay(queue_id, track_id, term) {
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
				for (queueDisplayI = 0; queueDisplayI < queue.length; queueDisplayI++) {
					term.echo(queueStrings[queueDisplayI]);
				}
			}
		});
}

/* queueTrack.js */

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

/* stopTrack.js */

function stopTrack(term){
	term.echo("Stopping track.");
	
	//stop all timed comments (had to switch from i to stopI due to a for loop collision :-P)
	for (stopI = 0; stopI < timeoutValue.length; stopI++)
	{
		clearTimeout(timeoutValue[stopI]);
	}
	timeoutValue = [];
	//stop all sounds playing using soundManager (soundcloud uses this)
	soundManager.stopAll();
}

/* timedComment.js */

//output timed comments to screen based on timestamp data
function timedComment(iteration, timestamp, username, body, term) {
	//iteration is passed to give unique timeouts to each comment
	timeoutValue[iteration] = setTimeout(function() {
		term.echo("[" + timestamp + "] " + username + ": " + body);
	}, timestamp);
}

