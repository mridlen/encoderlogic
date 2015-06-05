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