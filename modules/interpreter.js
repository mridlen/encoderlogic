function interpretCommand(cmd, term) {
    function runCommand(trigger, term, cmd) {
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


    for(i = 0; i < commands.length; i++) {
        command = commands[i];
        
        //parse the triggers
        for(j = 0; j < command.triggers.length; j++) {
            trigger = command.triggers[j];
            
            //compare cmd and the trigger
            if(cmd.split(" ")[0] == trigger.trigger) {
				runCommand(trigger, term, cmd);
            }
            
            //compare cmd and the trigger aliases
            if (typeof trigger.alias != "undefined") {
                (debugMode) ? console.log(trigger.alias) : 0;
                trigger.alias.forEach( function (alias) {
                    (debugMode) ? console.log(alias) : 0;
                    if(cmd.split(" ")[0] == alias) {
                        (debugMode) ? console.log("alias matched: " + alias) : 0;
                        runCommand(trigger, term, cmd);
                    }
                });
            }
        }
    }
}