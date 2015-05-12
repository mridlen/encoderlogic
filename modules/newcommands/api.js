commands.push({
    triggers: [
        {
            trigger: "api",
            help: "api .................... performs undocumented features for testing purposes. DO NOT USE",
            requireLoggedIn: false
        }
    ],

    fn: function(trigger, term, cmd) {
        //api command is reserved for temporary testing of new features
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
});