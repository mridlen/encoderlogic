if (cmd.split(" ")[0] == 'tracks' || (cmd.split(" ")[0] == 'stream' && loggedIn == 1) || cmd.split(" ")[0] == 'more') {
		tracks(cmd.split(" ")[0], cmd.split(" ")[1], cmd.split(" search ")[1], term);
	}