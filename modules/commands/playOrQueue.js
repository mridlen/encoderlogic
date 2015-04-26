function playOrQueue(arg0, arg1, arg2, term) {
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
	} else if (typeof arg1 !== 'undefined') {
		//term.echo("Using quick play id...");
		//our safe zone will be 1-trackLimit for quick play numbers (I eventually plan to move this to a variable that can be easily adjusted)
		//you will be able to supply a track id using syntax "play id <track id>"
		if(arg1 < trackLimit) {
			//play the quick play number
			//term.echo("quick play id supplied: " + (arg1));
			
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
			//if this is play, we want to play the stopped track
			if (arg0 == 'play' && currentTrack['trackId'] !== 0) {
				term.echo("Playing previously stopped track from beginning.");
				term.echo("currentTrack['trackId'] == " + currentTrack['trackId']);
				playTrack(currentTrack['trackId'], term);
			} else if (arg0 == 'queue') {
				//this will display the queue
				queueTrack(term);
			}
		
	}
}