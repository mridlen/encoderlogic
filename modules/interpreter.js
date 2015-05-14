function interpretCommand(cmd, term) {
    for(i = 0; i < commands.length; i++) {
        command = commands[i];
        for(j = 0; j < command.triggers.length; j++) {
            trigger = command.triggers[j];
            if(cmd.split(" ")[0] == trigger.trigger) {
				if ((loggedIn == false && trigger.requireLoggedIn == false) || loggedIn == true) {
					command.fn(trigger, term, cmd);
                    
                    //I'm dealing with an endless loop scenario with the pause and stop commands if I don't run return here
                    return;
                    
                    //the i for loop in those functions is conflicting in those cases
                    //in any case, I think that this is an acceptable solution for the moment
                    //since I'm not going to have any conceivable situation where there will be
                    //more than one trigger that matches a command (unless I make a mistake)
				}
            }
        }
    }
}