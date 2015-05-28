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
        
        term.echo(term.cols());
        term.echo(term.rows());
    }
});