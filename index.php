<?php
//this is merely a php file in case I want to add any php functionality... it currently doesn't do any of that
?>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <meta name="Description" content=""/>
    <link rel="shortcut icon" href=""/>
    <!--[if IE]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <link href="terminal/css/jquery.terminal.css" rel="stylesheet"/>
    <link rel="stylesheet" href="terminal/css/droidsansmono_regular_macroman/stylesheet.css" type="text/css" charset="utf-8" />

    <style>
body {
    background-color: #000000;
	width: 1500px;
}
.wrapper {
	position: relative;
    left: 25%;
    margin-left: 0px;
    background-color: #000000;
}
#term {
    position: absolute;
    top: 0px;
    left: -200px;
    z-index: 0;
}
.terminal, .cmd {
	font-family: 'droid_sans_monoregular';
    background-color: #000000;
    color: #006600;
    font-size: 12px;
	line-height: 14px;
    font-weight: bold;
}
.terminal .cmd span.inverted {
    background-color: #9C9CFF;
    color: #3939DE;
}
.terminal-output > div {
    padding-top: 0px; 
}
div.terminal-output div div {
    margin-top: 0px;
}
.cmd {
    height: 5em;
}
.cmd span {
    margin-top: 0px;
}
a:link {
    color: #00AA00;
}
a:visited {
    color: #22AA22;
}
a:hover {
    color: #22BB22;
}
    </style>
    <script src="http://connect.soundcloud.com/sdk.js"></script>
    <script src="terminal/js/jquery-1.7.1.min.js"></script>
	<script src="terminal/js/jquery.terminal-src.js"></script>
	
    <script>
    // initialize client with app credentials
    SC.initialize({
      client_id: '8c3cf644ea6051b32f5e612143e203e9',
      redirect_uri: 'http://beta.encoderlogic.com/callback.html'
    });
    //soundcloud user id (this is associated with the artist, not the end user)
	var soundcloudUserId = 14947567;
    var soundcloudUserName = "Encoder Logic";
    
    //the client is for the connecting user (the one who is looking at the webpage)
    var soundcloudUserIdClient = 0;
    var soundcloudUserNameClient = "anonymous";
    //OAuth Token... I hate to have to store it in a variable but accessing the stream next_href requires it for some odd reason
    //format is "oauth_token=xxxx"
    var soundcloudOAuthToken = "";
	
	//track limit (increase if your soundcloud has more sounds than the track limit)
	var trackLimit = 300;
    
    //setting the page size default here (for pagination purposes)
    var page_size = 20;
	
	//theme used for color formatting
	var theme = {
		quickIdColor: "cyan",
		trackIdColor: "red",
		artistIdColor: "yellow"
	}
	
	//more array contains the info needed to use the tracks command and then type "more" for the next page
	var moreArray = {
		//I'm using this variable to build the API URL string e.g. "/users/12345/tracks" (not sure if this is going to be needed in the future)
		tempAPIURL: "",
		//page is like the "i" variable to track the pagination
		page: 0,
		//this holds the next_href which is used for pulling up the next page
		nextPageURL: ""
	};
    
    //boolean loggedIn will return 1 once successfully logged in
    //by default it is 0
    var loggedIn = 0;
    
    // initiate auth popup
    //SC.connect(function() {
    //  SC.get('/me', function(me) { 
    //    alert('Hello, ' + me.username); 
    //  });
    //});

	//queue holds the track_ids that are pending on the playlist
	var queue = [];
	//queue strings holds the formatted strings from the queue
	var queueStrings = [];
	//queue loop boolean - if 1 will loop the queue instead of retiring played tracks, default 0 (off)
	var queueLoop = 0;
	//repeat, boolean - if 1 it will loop the track instead of moving on the next track, default is 0 (off)
	var repeat = 0;
	//showLinks, boolean - if 0 it will not display links, default is 1 (on)
	var showLinks = 1;
	
	var followers_ids = [];
	var currentTrack = {
		trackId: 0,
		trackArtist: "",
		trackName: "",
		trackDuration: 0,
		startedTimestamp: 0,
		trackPosition: 0
	};
	
	//timeoutValue array has the timeouts for all the comments
	var timeoutValue = [];
    
    //searchTracks array holds the trackIds of the recent search
    var searchTracks = [];
	
	//searchArtists array holds the userIds of the recent artist search
	var searchArtists = [];
    
    //this holds the relevant properties of the track object
    //var theListOfTracks = [];
	
	//for comment posting
	var commentTimestamp = 0;
	var postUrl = "";
	var bodyString = "";
		

$(function() {
    $('#term').terminal(function(cmd, term) {
		function authorizeSoundcloud() {
            term.echo( window.SC.storage().getItem('SC.accessToken') );
        }
        
		function queueTrack(track_id) {
			if (typeof track_id !== 'undefined') {
				SC.get("/tracks/" + track_id, function (track) {
					term.echo("Adding track to end of queue: " + track.user.username + " - " + track.title + " - link:" + track.permalink_url);
				});
				queue.push(track_id);
			} else {
				term.echo("");
				term.echo("=== " + queue.length + " TRACKS QUEUED ===");
				term.echo("");
				
				
				for (i = 0; i < queue.length; i++) {
					queueDisplay(i, queue[i]);
				}
				
				
				
				term.echo("");
			}
		}
        
		//I was forced to move this to a separate function to resolve a race condition
		function queueDisplay(queue_id, track_id) {
				SC.get("/tracks/" + track_id, function(track) {
					queueStrings[queue_id] = ("[[;"+ theme['quickIdColor'] +";]" + (queue_id + 1) + ")] [[;"+ theme['trackIdColor'] +";]" + track_id + "] - [[;"+ theme['artistIdColor'] +";]" + track.user.username + "] - " + track.title);
					if (showLinks == 1) {
						term.echo("\tlink: " + track.permalink_url);
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
        
		//a function to play tracks and work with the queue
		function playTrack(track_id) {
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
					
					console.log("Current position: " + currentTrack['trackPosition']);
					
                    //sound already references the track id when the API function is called, so nothing else to supply it but play()
					sound.play({
						position: currentTrack['trackPosition'],
                        onfinish: function() {
                            term.echo("Song finished playing.");
							if (repeat == 0) {
								//play next track in queue
								if (queue.length > 0) {	
									playNextTrack();
								}
							} else {
								term.echo("Repeat is on. Playing track from beginning.");
								playTrack(currentTrack['trackId']);
							}
                        }
                    });
					displayTimedComments(track_id, currentTrack['trackPosition']);

                    //sound.onfinish(function() {
                    //    term.echo("Song finished playing.");
                    //});
				});
			} else {
				term.echo("Not a valid number.");
			}
		}
        
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
        
		//output timed comments to screen based on timestamp data
		function timedComment(iteration, timestamp, username, body) {
			//iteration is passed to give unique timeouts to each comment
			timeoutValue[iteration] = setTimeout(function() {
				term.echo("[" + timestamp + "] " + username + ": " + body);
			}, timestamp);
		}
        
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
        
		function playOrQueue(arg0, arg1, arg2) {
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
					playTrack(arg2);
				} else if (arg0 == 'queue') {
					queueTrack(arg2);
				}
			} else if (typeof arg1 !== 'undefined') {
				//term.echo("Using quick play id...");
                //our safe zone will be 1-trackLimit for quick play numbers (I eventually plan to move this to a variable that can be easily adjusted)
                //you will be able to supply a track id using syntax "play id <track id>"
                if(arg1 < trackLimit) {
                    //play the quick play number
                    //term.echo("quick play id supplied: " + (arg1));
					
					if(arg0 == 'play') {
						playTrack(searchTracks[(arg1 - 1)]);
					} else if (arg0 == 'queue') {
						queueTrack(searchTracks[(arg1 - 1)]);
					}
                    
                } else {
                    term.echo("1-" + trackLimit + " range exceeded, playing track id instead");
                    //play the track id if out of the 1-trackLimit safety range
                    if(arg0 == 'play') {
						playTrack(arg1);
					} else if (arg0 == 'queue') {
						queueTrack(arg1);
					}
                }
            } else if (typeof arg1 === 'undefined') {
					//if this is play, we want to play the stopped track
					if (arg0 == 'play' && currentTrack['trackId'] !== 0) {
						term.echo("Playing previously stopped track from beginning.");
						term.echo("currentTrack['trackId'] == " + currentTrack['trackId']);
						playTrack(currentTrack['trackId']);
					} else if (arg0 == 'queue') {
						//this will display the queue
						queueTrack();
					}
				
			}
		}
        
		function stopTrack(){
			term.echo("Stopping track.");
			
			//stop all timed comments
			for (i = 0; i < timeoutValue.length; i++)
			{
				clearTimeout(timeoutValue[i]);
			}
			timeoutValue = [];
			//stop all sounds playing using soundManager (soundcloud uses this)
            soundManager.stopAll();
		}
		
		function pauseTrack() {
			//the amount of time elapsed since the track was played and then stopped
			var timeElapsed = Date.now() - currentTrack['startedTimestamp'];
			
			//add the amount of time elapsed to the current track position
			currentTrack['trackPosition'] = currentTrack['trackPosition'] + timeElapsed;
			
			term.echo("Track paused at " + currentTrack['trackPosition']);
			stopTrack();
		}
        
		function tracks(arg0, arg1, searchString) {
			//build the API query depending on the command used
			if (arg0 == 'tracks') {
				moreArray['tempAPIURL'] = "/users/" + soundcloudUserId + "/tracks";
			} else if (arg0 == 'stream') {
				moreArray['tempAPIURL'] = "/me/activities/tracks/affiliated";
			}
				
			//this function is used for the 'tracks' and 'stream' commands
			if (arg1 == 'help') {
                term.echo("\nsyntax: " + arg0 + " [ help | view | search (search string)]");
                term.echo("(no arguments): displays 20 most recent uploaded tracks");
                term.echo("help: show this menu");
                term.echo("view: go to the soundcloud page of the " + arg0);
                term.echo("search (search string): searches the tracks with the search string in the title or in the tags");
                term.echo("");
			} else if (arg1 == 'view') {
				if (arg0 == 'tracks') {
					SC.get("/users/" + soundcloudUserId, function (user) {
						window.location = user.permalink_url + "/tracks";
					});
				} else if (arg0 == 'stream') {
					window.location = "https://soundcloud.com/stream";
				}
            } else if (arg1 == 'search') {
                term.echo("Searching...");
				
                SC.get(moreArray['tempAPIURL'], {limit: trackLimit}, function (tracks) {
                    //clear searchTracks[]
                    searchTracks = [];
                    for (i = 0; i < tracks.length; i++) {
                        if (tracks[i].title.toLowerCase().search(searchString.toLowerCase()) >= 0 || tracks[i].tag_list.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                            term.echo((i+1) + ") " + tracks[i].id + " - " + tracks[i].user.username  + " - " + tracks[i].title);
							if (showLinks == 1) {
								term.echo('\tlink:' + tracks[i].permalink_url);
							}
                            searchTracks[i] = tracks[i].id;
                        }
                    }
                });
				
            } else { //this is 
				//if the more command is not used, reset the pagination value to 0 (start over with the pagination)
				if (arg0 != 'more') {
					term.echo("First page");
					moreArray['page'] = 0;
				}
				
				//hopefully this should echo 1-20, 21-40, 41-60, etc
                term.echo("Tracks " + ((page_size * (moreArray['page'])) + 1) + "-" + (page_size * (moreArray['page'] + 1)) + ":");
				
				//uncomment for debugging
				//term.echo("tempAPIURL == " + moreArray['tempAPIURL']);
				
                listTracks(arg0);
            }
        }
        
        function listTracks(arg0) {
            
            //clear searchTracks[]
            searchTracks = [];
            
            //first we need to split depending on if tracks/search or more is used
            //we will be dumping the list of tracks into theListOfTracks
            if (arg0 != 'more') { //arg0 == 'stream' || arg0 == 'tracks'
                if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
                    listTracksStream();
                } else {
                    listTracksTracks();
                }
            } else { //arg0 == 'more'
            //the only reason we care if arg0 == 'more' is because we have use a different method to query the API
                if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
                    moreTracksStream();
                } else {
                    moreTracksTracks();
                }
            }
        }
        function listTracksTracks() {
            var theListOfTracks = [];
			SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
				for (i = 0; i < page_size; i++) {
					theListOfTracks[i] = {
						id: tracks.collection[i].id,
						username: tracks.collection[i].user.username,
						title: tracks.collection[i].title,
						permalink_url: tracks.collection[i].permalink_url
					};
				}
				formatTracks(theListOfTracks);
				getNextHref(tracks.next_href);
			});
        }
        
        function listTracksStream() {
            var theListOfTracks = [];
            SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
                for (i = 0; i < page_size; i++) {
                    theListOfTracks[i] = {
                        id: tracks.collection[i].origin.id,
                        username: tracks.collection[i].origin.user.username,
                        title: tracks.collection[i].origin.title,
                        permalink_url: tracks.collection[i].origin.permalink_url
                    };
                }
				formatTracks(theListOfTracks);
				getNextHref(tracks.next_href);
            });
        }
        
        function moreTracksTracks() {
            var theListOfTracks = [];
            $.getJSON(moreArray['nextPageURL'], function( tracks ) {
                for (i = 0; i < page_size; i++) {
                    theListOfTracks[i] = {
                        id: tracks.collection[i].id,
                        username: tracks.collection[i].user.username,
                        title: tracks.collection[i].title,
                        permalink_url: tracks.collection[i].permalink_url
                    };
                }
				formatTracks(theListOfTracks);
				getNextHref(tracks.next_href);
            });
        }
        
        function moreTracksStream() {
            var theListOfTracks = [];
            $.getJSON(moreArray['nextPageURL'], function( tracks ) {
                for (i = 0; i < page_size; i++) {
                    theListOfTracks[i] = {
                        id: tracks.collection[i].origin.id,
                        username: tracks.collection[i].origin.user.username,
                        title: tracks.collection[i].origin.title,
                        permalink_url: tracks.collection[i].origin.permalink_url
                    };
                }
				formatTracks(theListOfTracks);
				getNextHref(tracks.next_href);
            });
        }
		
		function formatTracks(theListOfTracks) {
			console.log(theListOfTracks);
			//output the header
            term.echo("[[;"+ theme['quickIdColor'] +";]Quick Play ID] [[;"+ theme['trackIdColor'] +";]Track ID] [[;"+ theme['artistIdColor'] +";]Artist] Track");
			
            //output the list of tracks
            for (i = 0; i < page_size; i++) {
				term.echo("[[;"+ theme['quickIdColor'] +";]" + (i+1) + ")] [[;"+ theme['trackIdColor'] +";]" + theListOfTracks[i].id + "] - [[;"+ theme['artistIdColor'] +";]" + theListOfTracks[i].username  + "] - " + theListOfTracks[i].title);
				if (showLinks == 1) {
					term.echo('\tlink:' + theListOfTracks[i].permalink_url);
				}
                searchTracks[i] = theListOfTracks[i].id;
            }
		}
		
		function getNextHref(next_href) {
			 //load the next_href
            if (moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") { // i.e. stream
                //uncomment for debugging
                //term.echo(tracks.next_href + "&" + soundcloudOAuthToken);
                
                moreArray['nextPageURL'] = next_href + "&" + soundcloudOAuthToken;
				console.log("nextPageURL " + moreArray['nextPageURL']);
            } else {
                moreArray['nextPageURL'] = next_href;
				console.log("nextPageURL " + moreArray['nextPageURL']);
            }
			
			//add +1 to the pagination in case "more" is used
			moreArray['page']++;
		}
		
		function linksOff(arg1) {
			if (arg1 == 'off') {
				term.echo('\nDisclaimer: turning off links may break the Soundcloud terms of usage (attribution iii). \n' +
					             'See: https://developers.soundcloud.com/docs/api/terms-of-use#branding \n' +
								 'This option does not turn off all links, but it is intended to improve readability of tracks and queue commands. \n' +
								 'By turning links off you acknowledge this and absolve the website developer of any responsibility.' +
								 'You may turn links back on using the "links on" command. \n\n');
				term.push(function(command) {
					if (command.match(/y|yes/i)) {
						turnLinksOff();
						term.pop();
					} else if (command.match(/n|no/i)) {
						turnLinksOff();
						term.pop();
					}
				}, {
					prompt: 'Are you sure that you wish to continue? (y/n): ', 
				});
			} else if (arg1 == 'on') {
				showLinks = 1;
				term.echo("Links: on");
			} else {
				if (showLinks == 0) {
					term.echo("Links: off");
				} else if (showLinks == 1) {
					term.echo("Links: on");
				}
			}
		}
		
		function turnLinksOn() {
			showLinks = 1;
			page_size = 20;
			term.echo("Links: on");
		}
		
		function turnLinksOff() {
			showLinks = 0;
			page_size = 40;
			term.echo("Links: off");
		}
		
        //command interpreter here
        if (cmd.split(" ")[0] == 'help') {
            term.echo("\n=== Available commands ===\n");
			
            term.echo("help - displays this menu.");
			term.echo("about - displays websites, links and information.");
			term.echo("artist [help] - used for changing the artist page (in case you want some other music than >ENCODER LOGIC_)");
            term.echo("soundcloud - redirect to >ENCODER LOGIC_ Soundcloud.");
			term.echo("facebook - redirect to >ENCODER LOGIC_ Facebook page.");
            term.echo("tracks [help] - display latest uploaded tracks.");
			term.echo("more - display the next page of tracks (you have to run 'tracks' first, obviously)");
			term.echo("links [on|off] - turn on or off links from the tracks and queue commands. (Doubles page size.)");
            term.echo("play [help] - play a track (search for the track id using the tracks command).");
            term.echo("stop - stop currently playing track and reset the track position to the beginning.");
			term.echo("pause - pause current track at its current playing position (use play to resume).");
			term.echo("next - skip current track and play the next song in the queue");
			term.echo("repeat - turn track repeat on or off using 'repeat on' or 'repeat off' (alternatively use 1 or 0 e.g. 'repeat 1').");
			term.echo("queue [help] - display the play queue. (search for the track id using the tracks command).");
            term.echo("login - prompt for user login via soundcloud connect popup (this enables more commands!)");
            
            if (loggedIn == 1) {
                term.echo("logout - refreshes the page, effectively logging you out");
                term.echo("whoami - display your username");
                term.echo("follow [track] - follow the current artist (default: Encoder Logic) on Soundcloud. (or use 'follow track' to follow the currently playing track)");
                term.echo("comment Hey great track bro, check out my jams :D - enter a timed comment on the currently playing track \n\t(don't use quotes unless quoting, and no I will not check out your jams if you ask like that...).");
				term.echo("like - like the curretly playing track");
				term.echo("stream - display the tracks in your stream");
             }   
			term.echo("");
		}
        if (cmd.split(" ")[0] == 'soundcloud') {
            window.location = "http://soundcloud.com/encoder-logic";
        }
		if (cmd.split(" ")[0] == 'facebook') {
            window.location = "http://facebook.com/encoder-logic";
        }
		if (cmd.split(" ")[0] == 'about') {
			term.echo("\n");
            term.echo("Mark Ridlen is in a number of different projects");
			term.echo("================================================");
			term.echo("Encoder Logic (electronic) - inspired computer music of all electronic genres.");
			term.echo("\tlink: http://soundcloud.com/encoder-logic");
			term.echo("X1stance (electronic) - messianic electronic music to feed the soul.");
			term.echo("\tlink: http://x1stance.com/");
			term.echo("Cyclic Vendetta (post hardcore) - Mark is the current keyboard player for Cyclic Vendetta. (note: this music is not composed by Mark)");
			term.echo("\tlink: https://www.facebook.com/cyclicvendetta");
			term.echo("Antisoc (nerdcore) - Mark moonlights as a nerdcore rapper.");
			term.echo("\tlink: http://antisocialrap.com/");
			term.echo("Truth and Regret (futurepop) - futurepop dealing with philosophy, the future, and other interesting subjects.");
			term.echo("\tlink: http://antisocialrap.com/~mridlen/truthandregret");
			term.echo("Isotope Lab (electronic / big beat) - SciFi inspired electronic music in the vein of Crystal Method.");
			term.echo("\tlink: http://soundclick.com/isotopelab");
			term.echo("Introspective Journeys (symphonic electronic) - Mark's first music project that tended toward symphonic and progressive electronic music. Still plenty of good songs!");
			term.echo("\tlink: http://www.soundclick.com/introspectivejourneys");
			term.echo("\tlink: http://introspectivejourneys.bandcamp.com/");
			term.echo("");
        }
        if (cmd.split(" ")[0] == 'tracks' || cmd.split(" ")[0] == 'stream' || cmd.split(" ")[0] == 'more') {
            tracks(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" search ")[1]);
        } 
        if (cmd.split(" ")[0] == 'follow' && loggedIn == 1) {
			if (cmd.split(" ")[1] == 'track') {
				SC.get("/tracks/" + currentTrack['id'], function(track) {
					term.echo("Following " + track.user.username + ".");
					SC.put('/me/followings/' + track.user.id);
				});
			} else {
				term.echo("Following " + soundcloudUserId);
				SC.put('/me/followings/' + soundcloudUserId);
			}
			//this section is not working yet!!
			//SC.get("/user/" + soundcloudUserIdClient + "/followings/0", function(follows) {
			//		if(follows.id == soundcloudUserId) {
			//				term.echo("Current artist successfully followed");
			//		}
			//});
        }
		if (cmd.split(" ")[0] == 'play') {
			//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
            playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2]);
		}
		if (cmd.split(" ")[0] == 'stop') {
			stopTrack();
			currentTrack['trackPosition'] = 0;
		}
		if (cmd.split(" ")[0] == 'pause') {
			pauseTrack();
		}
		if(cmd.split(" ")[0] == 'next') {
			stopTrack();
			playNextTrack();
		}
		if(cmd.split(" ")[0] == 'repeat') {
			if (cmd.split(" ")[1] == 'on' || cmd.split(" ")[1] == 1) {
				//turn repeat on
				repeat = 1;
				term.echo("Repeat: on");
			} else if (cmd.split(" ")[1] == 'off' || cmd.split(" ")[1] == 0) {
				//turn repeat off
				repeat = 0;
				term.echo("Repeat: off");
			} else {
				if (repeat == 0) {
					term.echo("Repeat: off");
				} else if (repeat == 1) {
					term.echo("Repeat: on");
				}
			}
		}
		if(cmd.split(" ")[0] == 'comment' && loggedIn == 1) {
			if(cmd.split(" ").length == 1 || cmd.split(" ")[1] == "help") {
				term.echo("");
				term.echo("syntax:");
				term.echo("comment This track is awesome!!");
				term.echo("Note: do not enclose your comment in quotes unless you are quoting somebody or for purposes of irony");
				term.echo("");
			} else if (currentTrack['trackId'] != 0) {
				term.echo("comment: " + cmd.substring(8));
				commentTimestamp = parseInt(Date.now() - currentTrack['startedTimestamp']);
				postUrl = String('/tracks/' + currentTrack['trackId'] + '/comments');
				bodyString = String(cmd.substring(8));
				
				term.echo("commentTimestamp: " + commentTimestamp);
				term.echo("postUrl: " + postUrl);
				term.echo("bodyString: " + bodyString);
				SC.post(postUrl, {
					comment: {
						body: bodyString,
						timestamp: commentTimestamp
					}},
					function(comment, error) {
						if(error) {
							term.echo("Error: " + error.message);
						}
					}
				);
			}
		}
		if (cmd.split(" ")[0] == 'api') {
			//this api command is reserved for temporary testing of new features
			//this is undocumented, so if you have found this command, use at your own risk, because it may break something!
			for (o = 0; o < 5000; o = o + 50) {
				term.echo("o = " + o);
				SC.get("/users/" + soundcloudUserId + "/followers", {limit: 50, offset: o}, function (followers) {
					for (i = 0; i < followers.length; i++) {
						term.echo(followers[i].permalink_url);
						term.echo(followers[i].id);
						//term.echo("j = " + j +"; o = " + o + "; i = " + i);
						var j = o + i;
						//term.echo("j = " + j + "; o = " + o + "; i = " + i);
						followers_ids[j] = followers[i].id;
						term.echo(followers_ids[j]);
					}
				});
			}
			for (i = 0; i < followers_ids.length; i++) {
				term.echo(followers_ids[i]);
			}
        }
		if (cmd.split(" ")[0] == 'queue') {
            //queue is exactly like play except that we use the queueTrack instead of playTrack function
			//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
            playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2]);
		}
		if(cmd.split(" ")[0] == 'artist') {
			if (cmd.split(" ")[1] == 'help') {
				term.echo("");
				term.echo("Syntax: ");
				term.echo("artist search <search string> - display a list of artists that match your search parameters");
				term.echo("\tartist search encoder logic");
				term.echo("artist switch <quick id> - supply a number associated with the artist search");
				term.echo("\tartist switch 3");
				term.echo("");
			} else if (cmd.split(" ")[1] == 'search') {
				term.echo("searching for: " + cmd.split(" search ")[1]);
				SC.get("/users", { limit: 20, q: cmd.split(" search ")[1] }, function(artists) {
					for(i = 0; i < artists.length; i++) {
						term.echo("[[;" + theme['quickIdColor'] + ";]" + (i+1) + ")] [[;" + theme['artistIdColor'] + ";]" + artists[i].username + "]");
						searchArtists[i] = artists[i].id;
					}
				});
            } else if(cmd.split(" ")[1] == 'switch') {
				soundcloudUserId = searchArtists[cmd.split(" ")[2] - 1];
                SC.get("/users/" + soundcloudUserId, function(user) {
                    term.echo("Artist: " + user.username);
                    soundcloudUserName = user.username;
                    term.set_prompt("[" + soundcloudUserNameClient + "@" + soundcloudUserName + "]>");
                });
			} else {
                //if no arguments are supplied, just display the artist name
                SC.get("/users/" + soundcloudUserId, function(user) {
                    term.echo("Artist: " + user.username);
                });
            }
		}
        if(cmd.split(" ")[0] == 'login') {
            SC.connect(function() {
                SC.get("/me", function(me){
                    if(typeof me.username !== 'undefined') {
                        SC.get("/users/" + soundcloudUserId, function(user) {
                            //echo the Artist name, and then set the Artist name
                            term.echo("Artist: " + user.username);
                            soundcloudUserName = user.username;
                        });
                        //this call sets the oauth_token for the logged in user (needed for accessing the soundcloud stream)
                        SC.get("/users/" + soundcloudUserId + "/tracks", {limit: 1, linked_partitioning: 1}, function(tracks) {
                            //uncomment for debugging
                            //term.echo("tracks next_href: " + tracks.next_href);
                            //term.echo("split on &: " + tracks.next_href.split("&")[3]);
                            soundcloudOAuthToken = tracks.next_href.split("&")[3];
                        });
                        //echo the Username, and then set the Username
                        term.echo("User: " + me.username);
                        soundcloudUserNameClient = me.username;
                        soundcloudUserIdClient = me.id;
                        
                        loggedIn = 1;
                        term.set_prompt("[" + soundcloudUserNameClient + "@" + soundcloudUserName + "]>");
                    } else {
                        term.echo("Not logged in.");
                    }
                });
            });
        }
        if(cmd.split(" ")[0] == 'logout' && loggedIn == 1) {
            location.reload(true);
        }
        if(cmd.split(" ")[0] == 'whoami' && loggedIn == 1) {

            SC.get("/me", function(me){
                term.echo("User: " + me.username);
            });
		}
		if(cmd.split(" ")[0] == 'like' && loggedIn == 1) {
            term.echo("Liking current track: " + currentTrack['trackId']);
			SC.put("/me/favorites/" + currentTrack['trackId']);
			
            //this part hasn't been fixed yet
			//SC.get("/user/" + soundcloudUserIdClient + "/favorites/0", function(likes) {
			//		if(likes.id == currentTrack['trackId']) {
			//				term.echo("Current track successfully liked.");
			//		}
			//});
		}
		if(cmd.split(" ")[0] == 'links') {
			linksOff(cmd.split(" ")[1]);
		}
},{
        prompt: '[anonymous@Encoder Logic]>',
        greetings: 
            '            >ENCODER LOGIC _   \n\n' +
            '    ++ Official Terminal Server ++\n\n' +
            'Command Interface: version 1.3\n\n' +
            'Type "help" for commands or type "soundcloud" to skip directly to the music.\n' +
            'Type "login" to connect with soundcloud (this enables more commands!)\n\n',
        keypress: function(e) {
        },
        width: 1500,
        height: 768
    });

});
    </script>
</head>
<body>
	<div class="wrapper">
		<div id="term"></div>
	</div>
</body>
</html>
