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
                                term.echo(followings.collection[iMyYour].id + " - " + followings.collection[iMyYour].username + " - " + followings.collection[iMyYour].permalink_url);
                            }
                            moreArray['tempAPIURL'] = "followings";
                            moreArray['nextPageURL'] = followings.next_href;
                            moreArray['page']++;
                    });
                } else if (moreArray['tempAPIURL'] == "favorites") {
                    $.getJSON(moreArray['nextPageURL'], function( favorites ) {
                            console.log(favorites);
                            for(iMyYour = 0; iMyYour < page_size; iMyYour++) {
                                term.echo(favorites.collection[iMyYour].id + " - " + favorites.collection[iMyYour].user.username + " - " + favorites.collection[iMyYour].title + " - " + favorites.collection[iMyYour].permalink_url);
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