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
