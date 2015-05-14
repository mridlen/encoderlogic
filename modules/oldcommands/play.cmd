if (cmd.split(" ")[0] == 'play') {
		//"play" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		playOrQueue(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" ")[2], term);
	}