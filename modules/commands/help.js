commands.push({
    triggers: [
        {
            trigger: "help",
            alias: ["h", "he", "hel"],
            help: "help [help] ............ displays this menu. (You can also type 'help on', or 'help off')",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        if (typeof cmd.split(" ")[1] == "undefined") {
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
        } else if (cmd.split(" ")[1] == "help") {
            term.echo("Syntax:\nhelp on - turn on helper messages\nhelp off - turn off helper messages\n");
            if (helpMode == 1) {
                term.echo("Help mode: on");
            } else if (helpMode == 0) {
                term.echo("Help mode: off");
            }
        } else if (cmd.split(" ")[1] == "on" || cmd.split(" ")[1] == 1) {
            helpMode = 1;
            term.echo("Help mode: on");
        } else if (cmd.split(" ")[1] == "off" || cmd.split(" ")[1] == 0) {
            helpMode = 0;
            term.echo("Help mode: off");
        }
    }
});