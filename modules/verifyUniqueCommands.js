//this runs once when the program starts
//it verifies that there are no conflicts between the aliases and triggers (this will become more essential if people add new command modules)

commandList = [];
triggerList = [];
foundList = [];

// found this on http://stackoverflow.com/questions/6356122/javascript-if-in-x
////////
//create a custom function which will check value is in list or not
 Array.prototype.inArray = function (value)
// Returns true if the passed value is found in the
// array. Returns false if it is not.
{
    var i;
    for (i=0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};
////////

for(i = 0; i < commands.length; i++) {
    command = commands[i];
    
    //parse the triggers
    for(j = 0; j < command.triggers.length; j++) {
        trigger = command.triggers[j];
        
        //compare cmd and the trigger aliases
        if (typeof trigger.alias != "undefined") {
            trigger.alias.forEach( function (alias) {
                commandList.push(alias);
                triggerList.push(trigger.trigger);
            });
        }
    }
}

//uncomment for debugging (since this runs before the program loads, no point in adding this to debugMode 
//console.log(commandList);

commandList.forEach( function (commandOuter, index1) {
    commandList.forEach( function (commandInner, index2) {
		//console.log("commandOuter: " + commandOuter + ", commandInner: " + commandInner);
        if (commandOuter == commandInner && index1 != index2 && !foundList.inArray(index1) && !foundList.inArray(index2)) {
            console.log("Error: duplicate command trigger or alias found. Command: " + commandOuter + ", Triggers: " + triggerList[index1] + ", " + triggerList[index2]);
            foundList.push(index1);
            //console.log(foundList);
        }
    });
});