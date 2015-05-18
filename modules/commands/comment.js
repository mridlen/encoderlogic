commands.push({
    triggers: [
        {
            trigger: "comment",
            alias: ["c", "co", "com", "comm", "comme", "commen"],
            help: "comment Hey great track bro, check out my jams :D - enter a timed comment on the currently playing track \n\t(don't use quotes unless quoting, and no I will not check out your jams if you ask like that...).",
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


