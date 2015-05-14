commands.push({
    triggers: [
        {
            trigger: "artist",
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