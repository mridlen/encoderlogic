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
            term.echo(trigger.trigger + "followers");
            SC.get("/users/" + tempUserId + "/followers", {limit: page_size, linked_partitioning: 1}, function (followers, error) {
                if (!error) {
                    console.log(followers);
                    for(iMyYour = 0; iMyYour < page_size; iMyYour++) {
                        term.echo(followers.collection[iMyYour].id + " - " + followers.collection[iMyYour].username + " - " + followers.collection[iMyYour].permalink_url);
                    }
                    
                } else {
                    console.log(error);
                }
            });
        }
        
        function myYourFollowings (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + "followings");
            SC.get("/users/" + tempUserId + "/followings", {limit: page_size, linked_partitioning: 1}, function (followings, error) {
                if (!error) {
                    console.log(followings);
                    for(iMyYour = 0; iMyYour < page_size; iMyYour++) {
                        term.echo(followings.collection[iMyYour].id + " - " + followings.collection[iMyYour].username + " - " + followings.collection[iMyYour].permalink_url);
                    }
                    
                } else {
                    console.log(error);
                }
            });
        }
        
        function myYourLikes (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + "likes");
        }
        
        function myYourProfile (trigger, term, cmd, tempUserId) {
            term.echo(trigger.trigger + "profile");
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
