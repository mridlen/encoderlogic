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
    
    
	
	//declare global variables
	//queue holds the track_ids that are pending on the playlist
	var queue = [];
	var followers_ids = [];
	var currentTrack = {
		trackId: 0,
		trackArtist: "",
		trackName: "",
		trackDuration: 0,
		startedTimestamp: 0
	};
	
	//timeoutValue array has the timeouts for all the comments
	var timeoutValue = [];
    
    //searchTracks array holds the trackIds of the recent search
    var searchTracks = [];
	
	//searchArtists array holds the userIds of the recent artist search
	var searchArtists = [];
	
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
				term.echo("Adding track to end of queue: " + track_id);
				queue.push(track_id);
			}
			term.echo("");
			term.echo("=== QUEUE ===");
			term.echo("queue.length: " + queue.length);
			term.echo("");
			for (i = 0; i < queue.length; i++) {
				SC.get("/tracks/" + queue[i], function(track) {
                    term.echo("track_id: " + track_id + " " + track.user.username + " - " + track.title + "\n\tlink: " + track.permalink_url);
                });
			}
			term.echo("");
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
                    //2) give credit to the original creator of the music (me)
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
                    
                    //sound already references the track id when the API function is called, so nothing else to supply it but play()
					sound.play({
                        onfinish: function() {
                            term.echo("Song finished playing.");
							
                            //play next track in queue
							if (queue.length > 0) {	
								playNextTrack();
							}
                        }
                    });
					displayTimedComments(track_id);

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
		function displayTimedComments(track_id) {
			//uncomment for debugging:
			//term.echo("track_id: " + track_id);
			if (!isNaN(track_id)) {
				SC.get("/tracks/" + track_id + "/comments", function(comments) {
					for (i = 0; i < comments.length; i++) {
						//the purpose of this offset is to make original comments appear first in the order on screen
						var replyOffset = 0;
						if (comments[i].body.split("@").length < 2) {
							replyOffset = comments[i].timestamp;
						} else {
							replyOffset = comments[i].timestamp - 1;
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
				//there is one more way to use the queue command vs the play command
				if (arg0 == 'queue') {
					term.echo("Clear the " + arg0 + ":");
					term.echo("\t" + arg0 + " clear");
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
				term.echo("Using quick play id...");
                //our safe zone will be 1-trackLimit for quick play numbers (I eventually plan to move this to a variable that can be easily adjusted)
                //you will be able to supply a track id using syntax "play id <track id>"
                if(arg1 < trackLimit) {
                    //play the quick play number
                    term.echo("quick play id supplied: " + (arg1));
					
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
                            term.echo((i+1) + ") " + tracks[i].id + " - " + tracks[i].user.username  + " - " + tracks[i].title + ' \n\tlink:' + tracks[i].permalink_url);
                            searchTracks[i] = tracks[i].id;
                        }
                    }
                });
				
            } else {
				//if the more command is not used, reset the pagination value to 0 (start over with the pagination)
				if (arg0 != 'more') {
					term.echo("First page");
					moreArray['page'] = 0;
				}
				
				//hopefully this should echo 1-20, 21-40, 41-60, etc
                term.echo("Tracks " + ((20 * (moreArray['page'])) + 1) + "-" + (20 * (moreArray['page'] + 1)) + ":");
				term.echo("tempAPIURL == " + moreArray['tempAPIURL']);
				var page_size = 20;
				//eventually going to do linked_partitioning but I need to brush up on how that works before I'll be able to implement it
				// code example: http://jsfiddle.net/iambnz/tehd02y6/
				
				//I hate to do this because it duplicates a lot of stuff, but I can't find a better way to do it at the moment
				if (arg0 != 'more') {
					SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
						//term.echo("Length: " + tracks.collection.length);
						//term.echo("Stream: " + tracks.collection[1].origin.title);

						//clear searchTracks[]
						searchTracks = [];
						term.echo("[[;cyan;]Quick Play ID] [[;red;]Track ID] [[;yellow;]Artist] Track");
						
						for (i = 0; i < page_size; i++) {
							//I hate to do this, because it duplicates a lot of stuff, but I can't find a better way to do it at the moment
							if(arg0 == 'tracks') {
								term.echo("[[;cyan;]" + (i+1) + ")] [[;red;]" + tracks.collection[i].id + "] - [[;yellow;]" + tracks.collection[i].user.username  + "] - " + tracks.collection[i].title + ' \n\tlink:' + tracks.collection[i].permalink_url);
								//add to the searchTracks array for quick play ids
								searchTracks[i] = tracks.collection[i].id;
							} else if (arg0 == 'stream') {
								term.echo("[[;cyan;]" + (i+1) + ")] [[;red;]" + tracks.collection[i].origin.id + "] - [[;yellow;]" + tracks.collection[i].origin.user.username  + "] - " + tracks.collection[i].origin.title + ' \n\tlink:' + tracks.collection[i].origin.permalink_url);
								//add to the searchTracks array for quick play ids
								searchTracks[i] = tracks.collection[i].origin.id;
							}
						}
						
						//load the next_href
						moreArray['nextPageURL'] = tracks.next_href;
						term.echo(moreArray['nextPageURL']);
						//add +1 to the pagination in case "more" is used
						moreArray['page']++;
					});
				} else { // arg0 == 'more'
					//I've got this working for the tracks command but it is not yet working for the stream command
					$.getJSON( moreArray['nextPageURL'], function( tracks ) {
						//term.echo("Length: " + tracks.collection.length);
						//term.echo("Stream: " + tracks.collection[1].origin.title);

						//clear searchTracks[]
						searchTracks = [];
						term.echo("[[;cyan;]Quick Play ID] [[;red;]Track ID] [[;yellow;]Artist] Track");
						
						for (i = 0; i < page_size; i++) {
							//I hate to do this, because it duplicates a lot of stuff, but I can't find a better way to do it at the moment

								term.echo("[[;cyan;]" + (i+1) + ")] [[;red;]" + tracks.collection[i].id + "] - [[;yellow;]" + tracks.collection[i].user.username  + "] - " + tracks.collection[i].title + ' \n\tlink:' + tracks.collection[i].permalink_url);
								//add to the searchTracks array for quick play ids
								searchTracks[i] = tracks.collection[i].id;

						}
						
						//load the next_href
						moreArray['nextPageURL'] = tracks.next_href;
						term.echo(moreArray['nextPageURL']);
						//add +1 to the pagination in case "more" is used
						moreArray['page']++;
					});
					
				}
            }
        }
		
		//I *might* still need this....
		//these functions will work for the pagination
		//===========================
		function linked(obj){
			term.echo('linked called');
			if(obj.next_href)
			{
				loadMore(obj.next_href);
				console.log(obj.next_href)
			}

			$.each(obj.collection, function( key, val ) {
			   term.echo(val.title);
			});    
		}

		function loadMore(url){
			term.echo('loadMore called url: ' + url);
			$.getJSON( url, function( tracks ) {
				linked (tracks);
			});
		}
		//===========================
		//end pagination functions
		
		
		
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
            term.echo("play [help] - play a track (search for the track id using the tracks command).");
            term.echo("stop - stop currently playing track.");
			term.echo("next - skip current track and play the next song in the queue");
			term.echo("queue [help] - display the play queue. (search for the track id using the tracks command).");
            term.echo("login - prompt for user login via soundcloud connect popup (this enables more commands!)");
            
            if (loggedIn == 1) {
                term.echo("logout - refreshes the page, effectively logging you out");
                term.echo("whoami - display your username");
                term.echo("follow - follow the current artist (default: Encoder Logic) on Soundcloud.");
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
            SC.put('/me/followings/' + soundcloudUserId);
			
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
		}
		if(cmd.split(" ")[0] == 'next') {
			stopTrack();
			playNextTrack();
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
						term.echo((i+1) + ") " + artists[i].username);
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
