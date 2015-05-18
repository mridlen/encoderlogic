//this runs once when the program starts
//it verifies that there are no conflicts between the aliases and triggers (this will become more essential if people add new command modules)

commandList = [];

for(i = 0; i < commands.length; i++) {
    command = commands[i];
    
    //parse the triggers
    for(j = 0; j < command.triggers.length; j++) {
        trigger = command.triggers[j];
        commandList.push(trigger.trigger);
        
        //compare cmd and the trigger aliases
        if (typeof trigger.alias != "undefined") {
            trigger.alias.forEach( function (alias) {
                commandList.push(alias);
            });
        }
    }
}

//uncomment for debugging (since this runs before the program loads, no point in adding this to debugMode 
//console.log(commandList);

for (i = 0; i < commandList.length; i++) {
    for (j = 0; j < commandList.length; j++) {
        if (i != j && commandList[i] == commandList[j]) {
            console.log("Error: duplicate command trigger or alias found. Command: " + commandList[i] + " matches " + commandList[j] + ".");
        }
    }
}