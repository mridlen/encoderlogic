commands.push({
    triggers: [
        {
            trigger: "skip",
            alias: ["sk", "ski"],
            help: "skip [help] ............ skip forward or backward the desired number of seconds (use a negative number to skip back)",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd){
        //I might need to do some more error checking on this function
        // http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
        //
        // "Careful, this will also return true for an empty string, a string representing an integral number, true, false, null, an empty array,
        // an array containing a single integral number, an array containing a string representing an integral number, and maybe more. –  Dagg Nabbit Oct 8 '10 at 16:53"
        function isInt(n){
            return Number(n)===n && n%1===0;
        }
        
        if (cmd.split(" ")[1] == "help") {
            term.echo("Syntax:\nskip 15     (skips 15 seconds forward)\nskip -45    (skips 45 seconds backward)");
        } else if (typeof cmd.split(" ")[1] != "undefined" && currentTrack['trackId'] != 0) {
            if (parseInt(cmd.split(" ")[1]) > 0) {
                term.echo("Skipping forward " + parseInt(cmd.split(" ")[1]) + " seconds...");
            } else {
                term.echo("Skipping backward " + Math.abs(parseInt(cmd.split(" ")[1])) + " seconds...");
            }
            //pause the track
            //the amount of time elapsed since the track was played and then stopped
            var timeElapsed = Date.now() - currentTrack['startedTimestamp'];
            
            //add the amount of time elapsed to the current track position + the amount of time specified in argument 1
            currentTrack['trackPosition'] = currentTrack['trackPosition'] + timeElapsed + (parseInt(cmd.split(" ")[1]) * 1000);
            
            term.echo("Track paused at " + currentTrack['trackPosition']);
            stopTrack(term);
            
            currentTrack['trackStatus'] = "paused";
            
            //play the track
            playTrack(currentTrack['trackId'], term);
        }
        
        
        
	}
});