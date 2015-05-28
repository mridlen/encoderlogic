commands.push({
    triggers: [
        {
            trigger: "alias",
            alias: ["al", "ali", "alia"],
            help: "alias .................. display aliases available for all commands.",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
		if (typeof cmd.split(" ")[1] == "undefined") {
            term.echo("\n=== Alias List ===\nThese are shorthand commands that you can use in place of the full command\n");
            
            for(i = 0; i < commands.length; i++) {
                command = commands[i];
                for(j = 0; j < command.triggers.length; j++) {
                    trigger = command.triggers[j];
                    if ((loggedIn == false && trigger.requireLoggedIn == false) || loggedIn == true) {
                        aliasList = [];
                        aliasList.push(trigger.trigger + ": ");
                        if (typeof trigger.alias != "undefined") {
                            trigger.alias.forEach( function (singleAlias, index) {
                                aliasList.push(singleAlias);
                                if (index < trigger.alias.length - 1) {
                                    aliasList.push(", ");
                                }
                            });
                        }
                        aliasListJoined = aliasList.join("");
                        term.echo(aliasListJoined);
                    }
                }
            }
            
            term.echo("");
        }
	}
});