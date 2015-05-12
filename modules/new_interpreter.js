interpretCommand(cmd,term) {
    for(i = 0; i < commands.length; i++) {
        command = commands[i];
        for(j = 0; j < command.triggers.length; j++) {
            trigger = command.triggers[j];
            if(cmd.split(" ")[0] == trigger.trigger) {
				if ((loggedIn == false && command.trigger.requireLoggedIn == false) || loggedIn == true) {
					command.fn(trigger, term, cmd);
				}
            }
        }
    }
}