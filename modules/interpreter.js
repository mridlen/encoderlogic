//command interpreter
//if you want to add commands, just add another else if to the end
function interpretCommand(cmd, term) {
	if (cmd.split(" ")[0] == 'help') {
		help(term);
	} else if (cmd.split(" ")[0] == 'soundcloud') {
		soundcloud(term);
	} else if (cmd.split(" ")[0] == 'facebook') {
		facebook(term);
	} else if (cmd.split(" ")[0] == 'about') {
		about(term);
	} else if (cmd.split(" ")[0] == 'tracks' || (cmd.split(" ")[0] == 'stream' && loggedIn == 1) || cmd.split(" ")[0] == 'more') {
		tracks(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" search ")[1], term);
	} else if (cmd.split(" ")[0] == 'follow' && loggedIn == 1) {
		follow(cmd.split(" ")[1], term);
	} else if (cmd.split(" ")[0] == 'play') {
		//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2], term);
	} else if (cmd.split(" ")[0] == 'stop') {
		stopTrack(term);
		currentTrack['trackPosition'] = 0;
	} else if (cmd.split(" ")[0] == 'pause') {
		pauseTrack(term);
	} else if(cmd.split(" ")[0] == 'next') {
		stopTrack(term);
		playNextTrack();
	} else if(cmd.split(" ")[0] == 'repeat') {
		repeatModify(cmd.split(" ")[1], term);
	} else if(cmd.split(" ")[0] == 'comment' && loggedIn == 1) {
		//just for simplicity I'll pass it the entire command
		comment(cmd, term);
	} else if (cmd.split(" ")[0] == 'api') {
		api(cmd, term);
	} else if (cmd.split(" ")[0] == 'queue') {
		//queue is exactly like play except that we use the queueTrack instead of playTrack function
		//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2], term);
	} else if(cmd.split(" ")[0] == 'artist') {
		artist(cmd, term);
	} else if(cmd.split(" ")[0] == 'login') {
		login(term);
	} else if(cmd.split(" ")[0] == 'logout' && loggedIn == 1) {
		logout(term);
	} else if(cmd.split(" ")[0] == 'whoami' && loggedIn == 1) {
		whoami(term);
	} else if(cmd.split(" ")[0] == 'like' && loggedIn == 1) {
		like(term);
	} else if(cmd.split(" ")[0] == 'links') {
		links(cmd.split(" ")[1], term);
	} else if(cmd.split(" ")[0] == 'dir') {
        $.getJSON( "modules/directory_listing.php", function (dir) {
            alert(dir[0]);
        });
    } else if(cmd.split(" ")[0] == 'debug') {
		setDebugMode(cmd, term);
	} else if(cmd.split(" ")[0] == 'typed') {
		typed(cmd, term);
	}
}