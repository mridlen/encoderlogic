//command interpreter
//if you want to add commands, just add another else if to the end

if (cmd.split(" ")[0] == 'help') {
	help();
} else if (cmd.split(" ")[0] == 'soundcloud') {
	soundcloud();
} else if (cmd.split(" ")[0] == 'facebook') {
	facebook();
} else if (cmd.split(" ")[0] == 'about') {
	about();
} else if (cmd.split(" ")[0] == 'tracks' || cmd.split(" ")[0] == 'stream' || cmd.split(" ")[0] == 'more') {
	tracks(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" search ")[1]);
} else if (cmd.split(" ")[0] == 'follow' && loggedIn == 1) {
	follow(cmd.split(" ")[1]);
} else if (cmd.split(" ")[0] == 'play') {
	//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
	playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2]);
} else if (cmd.split(" ")[0] == 'stop') {
	stopTrack();
	currentTrack['trackPosition'] = 0;
} else if (cmd.split(" ")[0] == 'pause') {
	pauseTrack();
} else if(cmd.split(" ")[0] == 'next') {
	stopTrack();
	playNextTrack();
} else if(cmd.split(" ")[0] == 'repeat') {
	repeat(cmd.split(" ")[1]);
} else if(cmd.split(" ")[0] == 'comment' && loggedIn == 1) {
	//just for simplicity I'll pass it the entire command
	comment(cmd);
} else if (cmd.split(" ")[0] == 'api') {
	api(cmd);
} else if (cmd.split(" ")[0] == 'queue') {
	//queue is exactly like play except that we use the queueTrack instead of playTrack function
	//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
	playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2]);
} else if(cmd.split(" ")[0] == 'artist') {
	artist(cmd);
} else if(cmd.split(" ")[0] == 'login') {
	login();
} else if(cmd.split(" ")[0] == 'logout' && loggedIn == 1) {
	logout();
} else if(cmd.split(" ")[0] == 'whoami' && loggedIn == 1) {
	whoami();
} else if(cmd.split(" ")[0] == 'like' && loggedIn == 1) {
	like();
} else if(cmd.split(" ")[0] == 'links') {
	links(cmd.split(" ")[1]);
}