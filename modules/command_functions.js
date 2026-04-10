//commands object builder, built using command_functions.php (static bundle)

/* about.js */

commands.push({
    triggers: [
        {
            trigger: "about",
            alias: ["a", "ab", "abo", "abou"],
            help: "about .................. displays websites, links and information.",
            requireLoggedIn: false
        }
    ],

    fn: function(trigger, term, cmd) {
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
});

/* alias.js */

commands.push({
    triggers: [
        {
            trigger: "alias",
            alias: ["al", "ali", "alia"],
            help: "alias .................. display aliases available for all commands.",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
		if (typeof cmd.split(" ")[1] == "undefined") {
            term.echo("\n=== Alias List ===\nThese are shorthand commands that you can use in place of the full command\n");
            
            for(i = 0; i < commands.length; i++) {
                command = commands[i];
                for(j = 0; j < command.triggers.length; j++) {
                    trigger = command.triggers[j];
                    if ((loggedIn == false && trigger.requireLoggedIn == false) || loggedIn == true) {
                        aliasList = [];
                        aliasList.push(trigger.trigger + ": ");
                        if (typeof trigger.alias != "undefined") {
                            trigger.alias.forEach( function (singleAlias, index) {
                                aliasList.push(singleAlias);
                                if (index < trigger.alias.length - 1) {
                                    aliasList.push(", ");
                                }
                            });
                        }
                        aliasListJoined = aliasList.join("");
                        term.echo(aliasListJoined);
                    }
                }
            }
            
            term.echo("");
        }
	}
});

/* artist.js */

commands.push({
    triggers: [
        {
            trigger: "artist",
            alias: ["ar", "art", "arti", "artis"],
            help: "artist [help] .......... used for changing the artist page (in case you want some other music than >ENCODER LOGIC_)",
            requireLoggedIn: false
        }
    ],

    fn: function(trigger, term, cmd) {
        if (cmd.split(" ")[1] == 'help') {
            term.echo("");
            term.echo("Syntax: ");
            term.echo("artist search <search string> - display a list of artists that match your search parameters");
            term.echo("\tartist search encoder logic");
            term.echo("artist switch <quick id> - supply a number associated with the artist search");
            term.echo("\tartist switch 3");
            term.echo("");
        } else if (cmd.split(" ")[1] == 'search') {
            if (typeof cmd.split(" ")[2] != 'undefined') {
                term.echo("searching for: " + cmd.split(" search ")[1]);
                SC.get("/users", { limit: 20, q: cmd.split(" search ")[1] }, function(artists) {
                    for(i = 0; i < artists.length; i++) {
                        term.echo("[[;" + theme['quickIdColor'] + ";]" + (i+1) + ")] [[;" + theme['artistIdColor'] + ";]" + artists[i].username + "]");
                        searchArtists[i] = artists[i].id;
                    }
                });
            } else {
                term.echo("Please enter a search string. E.g. 'artist search encoder logic'");
            }
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
});

/* comment.js */

commands.push({
    triggers: [
        {
            trigger: "comment",
            alias: ["c", "co", "com", "comm", "comme", "commen"],
            help: "comment [help] ......... enter a timed comment on the currently playing track",
            requireLoggedIn: true
        }
    ],
    
    fn: function (trigger, term, cmd) {
        if(cmd.split(" ").length == 1 || cmd.split(" ")[1] == "help") {
            term.echo("");
            term.echo("syntax:");
            term.echo("comment This track is awesome!!");
            term.echo("Note: do not enclose your comment in quotes unless you are quoting somebody or for purposes of irony");
            term.echo("");
            term.echo("comment Hey great track bro, check out my jams :D - enter a timed comment on the currently playing track");
            term.echo("\t(don't use quotes unless quoting, and no I will not check out your jams if you ask like that...).");
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
                    }
                },
                function(comment, error) {
                    if(error) {
                        term.echo("Error: " + error.message);
                    }
                }
            );
        }
    }
});




/* debug.js */

commands.push({
    triggers: [
        {
            trigger: "debug",
            alias: ["d", "de", "deb", "debu"],
            help: "debug [on|off] ......... turn debug mode on or off (for development purposes)",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		status = cmd.split(" ")[1];
		if (status == "on" || status == "1") {
			debugMode = 1;
			term.echo("Debug mode: on");
		} else if (status == "off" || status == "0") {
			debugMode = 0;
			term.echo("Debug mode: off");
		} else if (typeof cmd.split(" ")[1] == "undefined") {
			if (debugMode == 1) {
				term.echo("Debug mode: on");
			} else {
				term.echo("Debug mode: off");
			}
		} else {
			term.echo("Invalid debug mode status (must be [on|1] or [off|0]).");
		}
	}
});

/* diagnostics.js */

commands.push({
    triggers: [
        {
            trigger: "diagnostics",
            alias: ["diag"],
            help: "diagnostics ............ display diagnostic information about the terminal environment",
            requireLoggedIn: false
        }
    ],

    fn: function(trigger, term, cmd) {
        //diagnostics command - displays info about the terminal environment
        //add more diagnostic output here as needed
        term.echo("Terminal columns: " + term.cols());
        term.echo("Terminal rows: " + term.rows());
    }
});


/* facebook.js */

commands.push({
    triggers: [
        {
            trigger: "facebook",
            alias: ["fa", "fac", "face", "faceb", "facebo", "faceboo"],
            help: "facebook ............... redirect to " +  soundcloudPermUserName + " Facebook page.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = facebookURL;
	}
});

/* follow.js */

commands.push({
    triggers: [
        {
            trigger: "follow",
            alias: ["f", "fo", "fol", "foll", "follo"],
            help: "follow [track] ......... follow the current artist (default: " + soundcloudPermUserName + ") on Soundcloud. (or use 'follow track' to follow the currently playing track)",
            requireLoggedIn: true
        },
        {
            trigger: "unfollow",
            alias: ["unf", "unfo", "unfol", "unfoll", "unfollo"],
            help: "unfollow [track] ....... unfollow the current artist (default: " + soundcloudPermUserName + ") on Soundcloud. (or use 'unfollow track' to unfollow the currently playing track)",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
        if (trigger.trigger == 'follow') {
            if (cmd.split(" ")[1] == 'track') {
                (debugMode) ? console.log(currentTrack['trackId']) : 0;
                SC.get("/tracks/" + currentTrack['trackId'], function(track) {
                    (debugMode) ? console.log(track) : 0;
                    
                    SC.put('/me/followings/' + track.user.id, function(error) {
                        if (error.status = "200 - OK") {
                            term.echo("Following " + track.user.username + ".");
                            (debugMode) ? console.log(error) : 0;
                        } else {
                            term.echo("Error in following user. Error object logged to web console.");
                            console.log(error);
                        }
                    });

                });
            } else {
                SC.put('/me/followings/' + soundcloudUserId, function(error) {
                    if (error.status = "200 - OK") {
                        term.echo("Following " + soundcloudUserName + ".");
                        (debugMode) ? console.log(error) : 0;
                    } else {
                        term.echo("Error in following user. Error object logged to web console.")
                        console.log(error);
                    }
                });

            }
        } else if (trigger.trigger == 'unfollow') {
            if (cmd.split(" ")[1] == 'track') {
                (debugMode) ? console.log(currentTrack['trackId']) : 0;
                SC.get("/tracks/" + currentTrack['trackId'], function(track) {
                    (debugMode) ? console.log(track) : 0;
                    
                    SC.delete('/me/followings/' + track.user.id, function(error) {
                        if (error.status = "200 - OK") {
                            term.echo("Unfollowing " + track.user.username + ".");
                            (debugMode) ? console.log(error) : 0;
                        } else {
                            term.echo("Error in unfollowing user. Error object logged to web console.");
                            console.log(error);
                        }
                    });

                });
            } else {
                SC.delete('/me/followings/' + soundcloudUserId, function(error) {
                    if (error.status = "200 - OK") {
                        term.echo("Unfollowing " + soundcloudUserName + ".");
                        (debugMode) ? console.log(error) : 0;
                    } else {
                        term.echo("Error in unfollowing user. Error object logged to web console.")
                        console.log(error);
                    }
                });

            }
        }
	}
});

/* help.js */

commands.push({
    triggers: [
        {
            trigger: "help",
            alias: ["h", "he", "hel"],
            help: "help [help] ............ displays this menu. (You can also type 'help on', or 'help off')",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        if (typeof cmd.split(" ")[1] == "undefined") {
            term.echo("\n=== Available commands ===\n");
            
            for(i = 0; i < commands.length; i++) {
                command = commands[i];
                for(j = 0; j < command.triggers.length; j++) {
                    trigger = command.triggers[j];
                    if ((loggedIn == false && trigger.requireLoggedIn == false) || loggedIn == true) {
                        term.echo(trigger.help);
                    }
                }
            }
            
            term.echo("");
        } else if (cmd.split(" ")[1] == "help") {
            term.echo("Syntax:\nhelp on - turn on helper messages\nhelp off - turn off helper messages\n");
            if (helpMode == 1) {
                term.echo("Help mode: on");
            } else if (helpMode == 0) {
                term.echo("Help mode: off");
            }
        } else if (cmd.split(" ")[1] == "on" || cmd.split(" ")[1] == 1) {
            helpMode = 1;
            term.echo("Help mode: on");
        } else if (cmd.split(" ")[1] == "off" || cmd.split(" ")[1] == 0) {
            helpMode = 0;
            term.echo("Help mode: off");
        }
    }
});

/* like.js */

commands.push({
    triggers: [
        {
            trigger: "like",
            alias: ["l", "li", "lik", "fav", "favo", "favor", "favori", "favorit", "favorite"],
            help: "like ................... like the currently playing track",
            requireLoggedIn: true
        },
        {
            trigger: "unlike",
            alias: ["unl", "unli", "unlik", "unfav", "unfavo", "unfavor", "unfavori", "unfavorit", "unfavorite"],
            help: "unlike ................. unlike the currently playing track (if you typed like by mistake... idiot)",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
        if(trigger.trigger == "like") {
            SC.put("/me/favorites/" + currentTrack['trackId'], function(error) {
                if (error.status = "200 - OK") {
                    term.echo("Liked current track: " + currentTrack['trackArtist'] + " - " + currentTrack['trackName']);
                    (debugMode) ? console.log(error) : 0;
                } else {
                    term.echo("Error liking track. Error object logged to web console.");
                    console.log(error);
                }
            });
        } else if (trigger.trigger == "unlike") {
            SC.delete("/me/favorites/" + currentTrack['trackId'], function(error) {
                if (error.status = "200 - OK") {
                    term.echo("Liked current track: " + currentTrack['trackArtist'] + " - " + currentTrack['trackName']);
                    (debugMode) ? console.log(error) : 0;
                } else {
                    term.echo("Error unliking track. Error object logged to web console.");
                    console.log(error);
                }
            });
        }
	}
});

/* links.js */

commands.push({
    triggers: [
        {
            trigger: "links",
            alias: ["lin", "link"],
            help: "links [on|off] ......... turn on or off links from the tracks and queue commands. (Doubles page size.)",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
        function turnLinksOn (term) {
            showLinks = 1;
            page_size = 20;
            term.echo("Links: on");
        }
        function turnLinksOff (term) {
            showLinks = 0;
            page_size = 40;
            term.echo("Links: off");
        }
        arg1 = cmd.split(" ")[1];
		if (arg1 == 'off') {
			term.echo('\nDisclaimer: turning off links may break the Soundcloud terms of usage (attribution iii). \n' +
							 'See: https://developers.soundcloud.com/docs/api/terms-of-use#branding \n' +
							 'This option does not turn off all links, but it is intended to improve readability of tracks and queue commands. \n' +
							 'By turning links off you acknowledge this and absolve the website developer of any responsibility.' +
							 'You may turn links back on using the "links on" command. \n\n');
			term.push(function(confirmationPrompt) {
				if (confirmationPrompt.match(/y|yes/i)) {
					turnLinksOff(term);
					term.pop();
				} else if (confirmationPrompt.match(/n|no/i)) {
					turnLinksOn(term);
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
});

/* login.js */

commands.push({
    triggers: [
        {
            trigger: "login",
            alias: ["lo", "log", "logi"],
            help: "login .................. prompt for user login via soundcloud connect popup (this enables more commands!)",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        SC.connect(function() {
            SC.get("/me", function(me){
                if(typeof me.username !== 'undefined') {
                    SC.get("/users/" + soundcloudUserId, function(user) {
                        //echo the Artist name, and then set the Artist name
                        term.echo("Artist: " + user.username);
                        soundcloudUserName = user.username;
                    });
                    //this call sets the oauth_token for the logged in user (needed for accessing the soundcloud stream)
                    SC.get("/users/" + soundcloudUserId + "/tracks", {limit: 1, linked_partitioning: 1}, function(tracks, error) {
                        if(!error) {
                            (debugMode) ? console.log(tracks) : 0;
                            (debugMode) ? console.log("tracks next_href: " + tracks.next_href) : 0;
                            (debugMode) ? console.log("split on &: " + tracks.next_href.split("&")[3]) : 0;
                            soundcloudOAuthToken = tracks.next_href.split("&")[3];
                        } else {
                            console.log(error);
                        }
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
});

/* logout.js */

commands.push({
    triggers: [
        {
            trigger: "logout",
            alias: ["logo", "logou"],
            help: "logout ................. refreshes the page, effectively logging you out",
            requireLoggedIn: true
        }
    ],
    
    fn: function (trigger, term, cmd) {
         location.reload(true);
    }
});

/* myYour.js */

commands.push({
    triggers: [
        {
            trigger: "my",
            help: "my [help] .............. access your likes / profile info / follows / followings",
            requireLoggedIn: true
        },
        {
            trigger: "your",
            alias: ["y", "yo", "you"],
            help: "your [help] ............ access the artist's likes / profile info / follows / followings",
            requireLoggedIn: false
        }
    ],
    
    fn: function (trigger, term, cmd) {
        function myYourHelp (trigger, term, cmd) {
            term.echo("Available sub commands:");
            term.echo(trigger.trigger + " followers");
            term.echo(trigger.trigger + " followings");
            term.echo(trigger.trigger + " likes");
            term.echo(trigger.trigger + " profile");
        }
        
        function myYourCommand (trigger, term, cmd) {
            var tempUserId = "";
            if(trigger.trigger == "my") {
                tempUserId = soundcloudUserIdClient;
            } else if (trigger.trigger == "your") {
                tempUserId = soundcloudUserId;
            }
            
            switch(cmd.split(" ")[1]) {
                case "followers":
                    myYourFollowers(trigger, term, cmd, tempUserId);
                    break;
                case "followings":
                    myYourFollowings(trigger, term, cmd, tempUserId);
                    break;
                case "likes":
                    myYourLikes(trigger, term, cmd, tempUserId);
                    break;
                case "profile":
                    myYourProfile(trigger, term, cmd, tempUserId);
                    break;
            }
        }
        
        function myYourFollowers (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + " followers");
            SC.get("/users/" + tempUserId + "/followers", {limit: page_size, linked_partitioning: 1}, function (followers, error) {
                if (!error) {
                    console.log(followers);
                    if (!followers.collection || followers.collection.length === 0) {
                        term.echo("(no followers to display)");
                    } else {
                        //bounds-check against collection length to avoid undefined access
                        for(iMyYour = 0; iMyYour < page_size && iMyYour < followers.collection.length; iMyYour++) {
                            term.echo(followers.collection[iMyYour].id + " - " + followers.collection[iMyYour].username + " - " + followers.collection[iMyYour].permalink_url);
                        }
                    }
                    moreArray['tempAPIURL'] = "followers";
                    moreArray['nextPageURL'] = followers.next_href;
                } else {
                    console.log(error);
                }
            });
        }

        function myYourFollowings (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + " followings");
            SC.get("/users/" + tempUserId + "/followings", {limit: page_size, linked_partitioning: 1}, function (followings, error) {
                if (!error) {
                    console.log(followings);
                    if (!followings.collection || followings.collection.length === 0) {
                        term.echo("(no followings to display)");
                    } else {
                        //bounds-check against collection length to avoid undefined access
                        for(iMyYour = 0; iMyYour < page_size && iMyYour < followings.collection.length; iMyYour++) {
                            term.echo(followings.collection[iMyYour].id + " - " + followings.collection[iMyYour].username + " - " + followings.collection[iMyYour].permalink_url);
                        }
                    }
                    moreArray['tempAPIURL'] = "followings";
                    moreArray['nextPageURL'] = followings.next_href;
                } else {
                    console.log(error);
                }
            });
        }

        function myYourLikes (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + " likes");
            SC.get("/users/" + tempUserId + "/favorites", {limit: page_size, linked_partitioning: 1}, function (favorites, error) {
                if (!error) {
                    console.log(favorites);
                    if (!favorites.collection || favorites.collection.length === 0) {
                        term.echo("(no likes to display)");
                    } else {
                        //bounds-check against collection length to avoid undefined access
                        for(iMyYour = 0; iMyYour < page_size && iMyYour < favorites.collection.length; iMyYour++) {
                            term.echo(favorites.collection[iMyYour].id + " - " + favorites.collection[iMyYour].user.username + " - " + favorites.collection[iMyYour].title + " - " + favorites.collection[iMyYour].permalink_url);
                        }
                    }
                    moreArray['tempAPIURL'] = "favorites";
                    moreArray['nextPageURL'] = favorites.next_href;
                } else {
                    console.log(error);
                }
            });
        }
        
        function myYourProfile (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + "profile");
            SC.get("/users/" + tempUserId, function (user, error) {
                term.echo("ID: " + user.id);
                term.echo("Username: " + user.username);
                term.echo("Full Name: " + user.full_name);
                term.echo("City: " + user.city);
                term.echo("Follower Count: " + user.followers_count);
                term.echo("Followings Count: " + user.followings_count);
                term.echo("Description: " + user.description);
                term.echo("Logo: " + user.avatar_url);
            });
        }
        
        if(cmd.split(" ")[1] != "help") {
            moreArray['page'] = 1;
        }
        if(trigger.trigger == "my") {
            term.echo("my");
            if(cmd.split(" ")[1] == "help") {
                myYourHelp(trigger, term, cmd);
            } else {
                myYourCommand(trigger, term, cmd);
            }
        } else if (trigger.trigger == "your") {
            term.echo("your");
            if(cmd.split(" ")[1] == "help") {
                myYourHelp(trigger, term, cmd);
            } else {
                myYourCommand(trigger, term, cmd);
            }
        }
    }
});


/* next.js */

commands.push({
    triggers: [
        {
            trigger: "next",
            alias: ["n", "ne", "nex"],
            help: "next ................... skip current track and play the next song in the queue",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        if (currentTrack['trackId'] != 0) {
            stopTrack(term);
            currentTrack['trackPosition'] = 0;
            playNextTrack(term);
        } else if (typeof queue[0] != 'undefined') {
            (debugMode) ? console.log("Next command was called, but no track is currently playing. Playing first track in queue.") : 0;
            
            //play the track
            playTrack(queue[0], term);
            
            //remove the first track from the queue
            //remove starting at element 0, remove 1 element (element 0)
            queue.splice(0, 1);
            queueStrings.splice(0, 1);
        }
	}
});

/* pause.js */

commands.push({
    triggers: [
        {
            trigger: "pause",
            alias: ["pa", "pau", "paus"],
            help: "pause .................. pause current track at its current playing position (use play to resume).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
		pauseTrack(term);
	}
});

/* play.js */

commands.push({
    triggers: [
        {
            trigger: "play",
            alias: ["p", "pl", "pla"],
            help: "play [help] ............ play a track (search for the track id using the tracks command).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(trigger.trigger, cmd.split(" ")[1], cmd.split(" ")[2], term);
	}
});

/* playlist.js */

commands.push({
    triggers: [
        {
            trigger: "playlist",
            alias: ["playl", "plali", "plalis"],
            help: "playlist Name .......... create a playlist with the current playing track and/or queue.",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
		if(typeof cmd.split(" ")[1] == "undefined") {
            term.echo("Please specify a playlist name.\n");
            term.echo("Syntax: playlist Name of Playlist");
        } else {
            var tempQueue = queue;
            
            //splice in the currently playing track at top
            tempQueue.unshift(currentTrack['trackId']);
            
            //I have very little idea what this map function does, but it was in the example code from soundcloud
            //https://developers.soundcloud.com/docs/api/guide#creating-sets
            var tempQueue = tempQueue.map(function(id) {
                return { id: id }
            });
            
            //split on space, remove the 0th element, and join back into a string
            var playlistArray = cmd.split(" ");
            playlistArray.splice(0, 1);
            var playlistName = playlistArray.join(" ");
            
            console.log(playlistName);
            var tempPlaylist = {
                title: playlistName,
                tracks: tempQueue
            };
            console.log(tempPlaylist);
            SC.post('/playlists', {
                playlist: tempPlaylist
            }, function (error) {
                console.log(error);
            });
        }
	}
});

/* queue.js */

commands.push({
    triggers: [
        {
            trigger: "queue",
            alias: ["q", "qu", "que", "queu"],
            help: "queue [help] ........... display the play queue. (search for the track id using the tracks command).",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		//queue is exactly like play except that we use the queueTrack instead of playTrack function
		//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(trigger.trigger, cmd.split(" ")[1], cmd.split(" ")[2], term);
	}
});

/* repeat.js */

commands.push({
    triggers: [
        {
            trigger: "repeat",
            alias: ["r", "re", "rep", "repe", "repea"],
            help: "repeat ................. turn track repeat on or off using 'repeat on' or 'repeat off' (alternatively use 1 or 0 e.g. 'repeat 1').",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		status = cmd.split(" ")[1];
		if (status == 'on' || status == 1) {
			//turn repeat on
			repeat = 1;
			term.echo("Repeat: on");
		} else if (status == 'off' || status == 0) {
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
});

/* repost.js */

commands.push({
    triggers: [
        {
            trigger: "repost",
            alias: ["repos", "repo"],
            help: "repost ................. repost the currently playing track to your profile.",
            requireLoggedIn: true
        },
        {
            trigger: "unrepost",
            alias: ["unrepo", "unrepos"],
            help: "unrepost ............... remove the repost for the currently playing track to your profile.",
            requireLoggedIn: true
        }
    ],

    fn: function (trigger, term, cmd){
        if (trigger.trigger == "repost") {
            SC.put("/e1/me/track_reposts/" + currentTrack['trackId'], function (error) {
                if (error = "201 - Created") {
                    term.echo("Track reposted successfully.");
                } else {
                    console.log(error);
                }
            });
        } else if (trigger.trigger == "unrepost") {
            SC.delete("/e1/me/track_reposts/" + currentTrack['trackId'], function (error) {
                if (error = "201 - Created") {
                    term.echo("Track successfully removed from reposts.");
                } else {
                    console.log(error);
                }
            });
        }
	}
});

/* skip.js */

commands.push({
    triggers: [
        {
            trigger: "skip",
            alias: ["sk", "ski"],
            help: "skip [help] ............ skip forward or backward the desired number of seconds (use a negative number to skip back)",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
        //I might need to do some more error checking on this function
        // http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
        //
        // "Careful, this will also return true for an empty string, a string representing an integral number, true, false, null, an empty array,
        // an array containing a single integral number, an array containing a string representing an integral number, and maybe more. �  Dagg Nabbit Oct 8 '10 at 16:53"
        function isInt(n){
            return Number(n)===n && n%1===0;
        }
        
        if (cmd.split(" ")[1] == "help") {
            term.echo("Syntax:\nskip 15     (skips 15 seconds forward)\nskip -45    (skips 45 seconds backward)");
        } else if (typeof cmd.split(" ")[1] != "undefined" && currentTrack['trackId'] != 0) {
            if (parseInt(cmd.split(" ")[1]) > 0) {
                term.echo("Skipping forward " + parseInt(cmd.split(" ")[1]) + " seconds...");
            } else {
                term.echo("Skipping backward " + Math.abs(parseInt(cmd.split(" ")[1])) + " seconds...");
            }
            //pause the track
            //the amount of time elapsed since the track was played and then stopped
            var timeElapsed = Date.now() - currentTrack['startedTimestamp'];
            
            //add the amount of time elapsed to the current track position + the amount of time specified in argument 1
            currentTrack['trackPosition'] = currentTrack['trackPosition'] + timeElapsed + (parseInt(cmd.split(" ")[1]) * 1000);
            
            term.echo("Track paused at " + currentTrack['trackPosition']);
            stopTrack(term);
            
            currentTrack['trackStatus'] = "paused";
            
            //play the track
            playTrack(currentTrack['trackId'], term);
        }
        
        
        
	}
});

/* soundcloud.js */

commands.push({
    triggers: [
        {
            trigger: "soundcloud",
            alias: ["so", "sou", "soun", "sound", "soundc", "soundcl", "soundclo", "soundclou"],
            help: "soundcloud ............. redirect to " + soundcloudPermUserName + " Soundcloud.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		window.location = soundcloudURL;
	}
});

/* stop.js */

commands.push({
    triggers: [
        {
            trigger: "stop",
            alias: ["s", "st", "sto"],
            help: "stop ................... stop currently playing track and reset the track position to the beginning.",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		stopTrack(term);
        currentTrack['trackStatus'] = "stopped";
		currentTrack['trackPosition'] = 0;
	}
});

/* tenforward.js */

commands.push({
    triggers: [
        {
            trigger: "ten",
            alias: ["Ten Forward", "Ten forward", "TEN FORWARD"],
            help: "ten forward ............ Play the Ten Forward album.",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		term.echo("Ten Forward Album loading...");
		//queue is exactly like play except that we use the queueTrack instead of playTrack function
		//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		//
		/*
		queueTrack(233067171, term);
		queueTrack(233067294, term);
		queueTrack(233067471, term);
		queueTrack(233067603, term);
		queueTrack(233067706, term);
		queueTrack(233067896, term);
		queueTrack(233068022, term);
		queueTrack(233068213, term);
		queueTrack(233068313, term);
		queueTrack(233068668, term);
		queueTrack(233068879, term);
		*/

		queue.push(233067171);
		queue.push(233067294);
		queue.push(233067471);
		queue.push(233067603);
		queue.push(233067706);
		queue.push(233067896);
		queue.push(233068022);
		queue.push(233068213);
		queue.push(233068313);
		queue.push(233068668);
		queue.push(233068879);
		
		term.echo("Ten Forward has been queued. Type \"play\" to listen.");
	}
});


/* theme.js */

commands.push({
    triggers: [
        {
            trigger: "theme",
            alias: ["th", "the", "them"],
            help: "theme [name] ........... change color theme. 'theme list' to see options",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        //==========================================================
        //themes dictionary
        //----------------------------------------------------------
        //each theme defines:
        //  CSS colors: bgColor, textColor, cursorColor, link/visited/hover
        //  jquery.terminal format colors used in [[;color;]text] strings:
        //    quickIdColor, trackIdColor, artistIdColor,
        //    streamableColor, streamableTrue, streamableFalse
        //see modules/globals.js for the global 'theme' object this updates
        //==========================================================
        var themes = {
            "default": {
                description: "original Encoder Logic green-on-black",
                bgColor: "#000000",
                textColor: "#006600",
                cursorColor: "#006600",
                glowColor: "rgba(0, 170, 0, 0.9)",
                widgetColor: "#006600",
                linkColor: "#00AA00",
                visitedColor: "#22AA22",
                hoverColor: "#22BB22",
                quickIdColor: "cyan",
                trackIdColor: "red",
                artistIdColor: "yellow",
                streamableColor: "grey",
                streamableTrue: "green",
                streamableFalse: "red"
            },
            "matrix": {
                description: "bright green on black, wake up neo",
                bgColor: "#000000",
                textColor: "#00FF41",
                cursorColor: "#00FF41",
                glowColor: "rgba(0, 255, 65, 0.9)",
                widgetColor: "#00FF41",
                linkColor: "#88FF88",
                visitedColor: "#44CC44",
                hoverColor: "#CCFFCC",
                quickIdColor: "#00FFAA",
                trackIdColor: "#66FF66",
                artistIdColor: "#AAFFAA",
                streamableColor: "#008822",
                streamableTrue: "#00FF41",
                streamableFalse: "#AA4400"
            },
            "amber": {
                description: "amber CRT monitor, 1980s vibes",
                bgColor: "#100800",
                textColor: "#FFB000",
                cursorColor: "#FFB000",
                glowColor: "rgba(255, 176, 0, 0.9)",
                widgetColor: "#FFB000",
                linkColor: "#FFCC33",
                visitedColor: "#CC8800",
                hoverColor: "#FFDD66",
                quickIdColor: "#FFDD66",
                trackIdColor: "#FF8800",
                artistIdColor: "#FFCC33",
                streamableColor: "#885500",
                streamableTrue: "#FFB000",
                streamableFalse: "#884400"
            },
            "c64": {
                description: "Commodore 64 light blue on dark blue",
                bgColor: "#4040E0",
                textColor: "#A0A0FF",
                cursorColor: "#A0A0FF",
                glowColor: "rgba(200, 200, 255, 0.8)",
                widgetColor: "#A0A0FF",
                linkColor: "#FFFFFF",
                visitedColor: "#CCCCFF",
                hoverColor: "#FFFF88",
                quickIdColor: "#FFFFFF",
                trackIdColor: "#FFFF88",
                artistIdColor: "#88FFFF",
                streamableColor: "#8080CC",
                streamableTrue: "#FFFFFF",
                streamableFalse: "#FF8888"
            },
            "ice": {
                description: "cold cyan on black",
                bgColor: "#000811",
                textColor: "#00CCFF",
                cursorColor: "#00CCFF",
                glowColor: "rgba(0, 204, 255, 0.9)",
                widgetColor: "#00CCFF",
                linkColor: "#66DDFF",
                visitedColor: "#4499CC",
                hoverColor: "#AAEEFF",
                quickIdColor: "#AAEEFF",
                trackIdColor: "#FFFFFF",
                artistIdColor: "#66DDFF",
                streamableColor: "#336688",
                streamableTrue: "#00CCFF",
                streamableFalse: "#FF6666"
            },
            "dos": {
                description: "classic DOS grey-on-black",
                bgColor: "#000000",
                textColor: "#CCCCCC",
                cursorColor: "#CCCCCC",
                glowColor: "rgba(204, 204, 204, 0.6)",
                widgetColor: "#CCCCCC",
                linkColor: "#FFFFFF",
                visitedColor: "#AAAAAA",
                hoverColor: "#FFFFFF",
                quickIdColor: "cyan",
                trackIdColor: "yellow",
                artistIdColor: "white",
                streamableColor: "grey",
                streamableTrue: "#00FF00",
                streamableFalse: "#FF5555"
            },
            "paper": {
                description: "black on white, the bland one",
                bgColor: "#FFFFFF",
                textColor: "#000000",
                cursorColor: "#330000",
                glowColor: "none",
                widgetColor: "#000000",
                linkColor: "#000000",
                visitedColor: "#000000",
                hoverColor: "#444444",
                quickIdColor: "black",
                trackIdColor: "black",
                artistIdColor: "black",
                streamableColor: "black",
                streamableTrue: "black",
                streamableFalse: "black"
            },
            "hotdog": {
                description: "Windows 3.1 hotdog stand - you have been warned",
                bgColor: "#FFFF00",
                textColor: "#000000",
                cursorColor: "#FF0000",
                glowColor: "rgba(255, 0, 0, 0.9)",
                widgetColor: "#FF0000",
                linkColor: "#AA0000",
                visitedColor: "#660000",
                hoverColor: "#FF0000",
                quickIdColor: "#AA0000",
                trackIdColor: "black",
                artistIdColor: "#660066",
                streamableColor: "#440000",
                streamableTrue: "#008800",
                streamableFalse: "#AA0000"
            }
        };

        //==========================================================
        //applyTheme - apply the given theme name to CSS + global theme
        //==========================================================
        function applyTheme(name) {
            var t = themes[name];
            if (!t) {
                term.echo("Unknown theme: " + name);
                term.echo("Type 'theme list' to see available themes.");
                return;
            }

            //--- apply CSS colors ---
            $('.terminal').css({"background-color": t.bgColor, "color": t.textColor});
            $('.cmd').css({"background-color": t.bgColor, "color": t.textColor});
            $('body').css({"background-color": t.bgColor});
            $('.wrapper').css({"background-color": t.bgColor});
            //cursor glow — overrides hardcoded green box-shadow in jquery.terminal.css
            //"none" disables the glow entirely (used by paper theme)
            var shadow = (t.glowColor === "none") ? "none" : "0 0 5px " + t.glowColor;
            $('.cursor').css({
                "background-color": t.cursorColor,
                "background": t.cursorColor,
                "color": t.bgColor,
                "box-shadow": shadow,
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow
            });
            $('a').css({"color": t.linkColor});
            $('a:link').css({"color": t.linkColor});
            $('a:visited').css({"color": t.visitedColor});

            //--- update global theme object ---
            //used by jquery.terminal format strings [[;color;]text]
            //see globals.js for the original definition
            theme.quickIdColor = t.quickIdColor;
            theme.trackIdColor = t.trackIdColor;
            theme.artistIdColor = t.artistIdColor;
            theme.streamableColor = t.streamableColor;
            theme.streamableTrue = t.streamableTrue;
            theme.streamableFalse = t.streamableFalse;
            theme.name = name;

            //--- update SoundCloud widget accent color ---
            //widgetPlayer lives in modules/soundcloud-stub.js and is exposed globally
            if (window.widgetPlayer && typeof window.widgetPlayer.setColor === 'function') {
                window.widgetPlayer.setColor(t.widgetColor);
            }

            term.echo("Theme set to: " + name + " (" + t.description + ")");
        }

        //==========================================================
        //listThemes - print all available themes
        //==========================================================
        function listThemes() {
            term.echo("Available themes:");
            var current = theme.name || "default";
            for (var name in themes) {
                var marker = (name === current) ? " * " : "   ";
                term.echo(marker + name + " - " + themes[name].description);
            }
            term.echo("");
            term.echo("Usage: theme <name>");
        }

        //==========================================================
        //parse sub-command and dispatch
        //==========================================================
        var arg = cmd.split(" ")[1];

        if (!arg || arg === "list" || arg === "help") {
            listThemes();
        } else {
            applyTheme(arg);
        }
    }
});

/* tracks.js */

commands.push({
    triggers: [
        {
            trigger: "tracks",
            alias: ["t", "tr", "tra", "trac", "track"],
            help: "tracks [help] .......... display latest uploaded tracks.",
            requireLoggedIn: false
        },
		{
			trigger: "stream",
            alias: ["str", "stre", "strea"],
			help: "stream ................. display the tracks in your stream",
			requireLoggedIn: true
		},
		{
			trigger: "more",
            alias: ["m", "mo", "mor"],
			help: "more ................... display the next page of tracks (you have to run 'tracks' or 'stream' first, obviously)",
			requireLoggedIn: false
		}
    ],

	fn: function (trigger, term, cmd) {
		if ((trigger.trigger == 'tracks' || trigger.trigger == 'stream' && loggedIn == 1) || trigger.trigger == 'more') {
			arg0 = trigger.trigger;
			arg1 = cmd.split(" ")[1];
			searchString = cmd.split(" search ")[1];
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
				term.echo("search (search string): searches the tracks with the search string in the title or tags or genre");
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
						(debugMode) ? console.log("track: " + tracks[i].title + ", string: " + tracks[i].tag_list.toLowerCase() + ", >> result: " + tracks[i].tag_list.toLowerCase().search(searchString.toLowerCase())) : 0;
						
						if (tracks[i].title.toLowerCase().search(searchString.toLowerCase()) != -1 || tracks[i].tag_list.toLowerCase().search(searchString.toLowerCase()) != -1 || tracks[i].genre.toLowerCase().search(searchString.toLowerCase()) != -1) {
							term.echo("[[;"+ theme['quickIdColor'] +";]" + (i+1) + ")] [[;"+ theme['trackIdColor'] +";]" +  tracks[i].id + "] - [[;"+ theme['artistIdColor'] +";]" + tracks[i].user.username  + "] - " + tracks[i].title);
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
					moreArray['page'] = 0;
				}
				
				//hopefully this should echo 1-20, 21-40, 41-60, etc
				term.echo("Items " + ((page_size * (moreArray['page'])) + 1) + "-" + (page_size * (moreArray['page'] + 1)) + ":");
				
				(debugMode) ? term.echo("tempAPIURL == " + moreArray['tempAPIURL']) : 0;
				if ((moreArray['tempAPIURL'] == "/users/" + soundcloudUserId + "/tracks") || (moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated")) {
                    listTracks(arg0, term);
                } else if (moreArray['tempAPIURL'] == "followers" || moreArray['tempAPIURL'] == "followings") {
                    console.log(moreArray['nextPageURL']);
                    $.getJSON(moreArray['nextPageURL'], function( followings ) {
                            console.log(followings);
                            for(iMyYour = 0; iMyYour < page_size; iMyYour++) {
                                if(typeof followings.collection[iMyYour] != "undefined") {
                                    term.echo(followings.collection[iMyYour].id + " - " + followings.collection[iMyYour].username + " - " + followings.collection[iMyYour].permalink_url);
                                }
                            }
                            moreArray['tempAPIURL'] = "followings";
                            moreArray['nextPageURL'] = followings.next_href;
                            moreArray['page']++;
                    });
                } else if (moreArray['tempAPIURL'] == "favorites") {
                    $.getJSON(moreArray['nextPageURL'], function( favorites ) {
                            console.log(favorites);
                            for(iMyYour = 0; iMyYour < page_size; iMyYour++) {
                                if(typeof favorites.collection[iMyYour] != "undefined") {
                                    term.echo(favorites.collection[iMyYour].id + " - " + favorites.collection[iMyYour].user.username + " - " + favorites.collection[iMyYour].title + " - " + favorites.collection[iMyYour].permalink_url);
                                }
                            }
                            moreArray['tempAPIURL'] = "favorites";
                            moreArray['nextPageURL'] = favorites.next_href;
                            moreArray['page']++;
                    });
                }
			}
		}
	}
});

