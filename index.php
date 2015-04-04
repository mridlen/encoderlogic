<?php

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
    position: absolute;
    left: 25%;
    margin-left: 0px;
}
.wrapper {
    position: relative;
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
    
    // initiate auth popup
    //SC.connect(function() {
    //  SC.get('/me', function(me) { 
    //    alert('Hello, ' + me.username); 
    //  });
    //});
	
	//declare global variables
	//queue holds the track_ids that are pending on the playlist
	var queue = [];
	
	//soundcloud user id
	var soundcloudUserId = 14947567;

$(function() {
    $('#term').terminal(function(cmd, term) {
		
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
                        term.echo("Now Playing: " + track.user.username + " - " + track.title + "\n\tlink: " + track.permalink_url);
                    });
                    //stops any currently playing track
                    soundManager.stopAll();
                    
                    //sound already references the track id when the API function is called, so nothing else to supply it but play()
					sound.play({
                        onfinish: function() {
                            //I'm going to eventually set up queueing here
                            term.echo("Song finished playing.");
								term.echo("Playing next track.");
							if (queue.length > 0) {	
								playTrack(queue[0]);
								
								//remove the track from the queue
								//0 - array element (0 == top of queue)
								//1 - number of elements to remove
								queue.splice(0, 1);
							}
                        }
                    });

                    //sound.onfinish(function() {
                    //    term.echo("Song finished playing.");
                    //});
				});
			} else {
				term.echo("Not a valid number.");
			}
		}
        //command interpreter here
        if (cmd.split(" ")[0] == 'help') {
            term.echo("\n=== Available commands ===\n");
            term.echo("help - displays this menu.");
			term.echo("about - displays websites, links and information.");
            term.echo("soundcloud - redirect to >ENCODER LOGIC_ Soundcloud.");
            term.echo("follow - follow >ENCODER LOGIC_ on Soundcloud.");
            term.echo("tracks [help] - display latest uploaded tracks.");
			term.echo("play [track id] - play a track (search for the track id using the tracks command).");
			term.echo("queue [track id] - display the play queue. If the optional track id is specified, it will add the track to the play queue.");
            term.echo("stop - stop currently playing track.");
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
        if (cmd.split(" ")[0] == 'tracks') {
            if (cmd.split(" ")[1] == 'help') {
                term.echo("\nsyntax: tracks [ help | view | search (search string)]");
                term.echo("(no arguments): displays 20 most recent uploaded tracks");
                term.echo("help: show this menu");
                term.echo("view: go to the soundcloud page of all the tracks");
                term.echo("search (search string): searches the tracks with the search string in the title");
                term.echo("");
			} else if (cmd.split(" ")[1] == 'view') {
				window.location = "http://soundcloud.com/encoder-logic/tracks";
            } else if (cmd.split(" ")[1] == 'search') {
                term.echo("Searching...");
                SC.get("/users/" + soundcloudUserId + "/tracks", {limit: 300}, function(tracks){
                    for (i = 0; i < tracks.length; i++) {
                        if (tracks[i].title.toLowerCase().search(cmd.split(" search ")[1].toLowerCase()) >= 0 || tracks[i].tag_list.toLowerCase().search(cmd.split(" search ")[1].toLowerCase()) >= 0) {
                            term.echo(tracks[i].id + " - " + tracks[i].user.username  + " - " + tracks[i].title + ' \n\tlink:' + tracks[i].permalink_url);
                        }
                    }
                });
            } else {
                term.echo("20 most recent tracks:");
                SC.get("/users/" + soundcloudUserId + "/tracks", {limit: 20}, function(tracks){
                    for (i = 0; i < tracks.length; i++) {    
                        term.echo(tracks[i].id + " - " + tracks[i].user.username  + " - " + tracks[i].title + ' \n\tlink:' + tracks[i].permalink_url);
                    }
                });
            }
        } 
        if (cmd.split(" ")[0] == 'follow') {
            SC.connect(function() {
                SC.put('/me/followings/' + soundcloudUserId);
            });
        }
		if (cmd.split(" ")[0] == 'play') {
			playTrack(cmd.split(" ")[1]);
		}
		if (cmd.split(" ")[0] == 'stop') {
            soundManager.stopAll();
		}
        if (cmd.split(" ")[0] == 'api') {
			//this api command is reserved for temporary testing of new features
			var followers_ids = [];
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
						term.echo(followers_ids[j].id);
					}
				});
			}
			for (i = 0; i < followers_ids.length; i++) {
					term.echo(followers_ids[i]);
			}
        }
		if (cmd.split(" ")[0] == 'queue') {
			queueTrack(cmd.split(" ")[1]);
		}
},{
        prompt: 'ENCODER LOGIC >',
        greetings: 
            '            >ENCODER LOGIC _   \n\n' +
            '    ++ Official Terminal Server ++\n\n' +
            'Command Interface: version 1.3\n\nType "help" for commands or type "soundcloud" to skip directly to the music.',
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
