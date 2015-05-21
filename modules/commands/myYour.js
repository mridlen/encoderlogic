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
        if(trigger.trigger == "my") {
            term.echo("my");
        } else if (trigger.trigger == "your") {
            term.echo("your");
        }
    }
});
