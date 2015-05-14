commands.push({
    triggers: [
        {
            trigger: "help",
            help: "help ................... displays this menu.",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
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
    }
});