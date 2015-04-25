function help() {
	term.echo("\n=== Available commands ===\n");
	
	term.echo("help - displays this menu.");
	term.echo("about - displays websites, links and information.");
	term.echo("artist [help] - used for changing the artist page (in case you want some other music than >ENCODER LOGIC_)");
	term.echo("soundcloud - redirect to >ENCODER LOGIC_ Soundcloud.");
	term.echo("facebook - redirect to >ENCODER LOGIC_ Facebook page.");
	term.echo("tracks [help] - display latest uploaded tracks.");
	term.echo("more - display the next page of tracks (you have to run 'tracks' first, obviously)");
	term.echo("links [on|off] - turn on or off links from the tracks and queue commands. (Doubles page size.)");
	term.echo("play [help] - play a track (search for the track id using the tracks command).");
	term.echo("stop - stop currently playing track and reset the track position to the beginning.");
	term.echo("pause - pause current track at its current playing position (use play to resume).");
	term.echo("next - skip current track and play the next song in the queue");
	term.echo("repeat - turn track repeat on or off using 'repeat on' or 'repeat off' (alternatively use 1 or 0 e.g. 'repeat 1').");
	term.echo("queue [help] - display the play queue. (search for the track id using the tracks command).");
	term.echo("login - prompt for user login via soundcloud connect popup (this enables more commands!)");
	
	if (loggedIn == 1) {
		term.echo("logout - refreshes the page, effectively logging you out");
		term.echo("whoami - display your username");
		term.echo("follow [track] - follow the current artist (default: Encoder Logic) on Soundcloud. (or use 'follow track' to follow the currently playing track)");
		term.echo("comment Hey great track bro, check out my jams :D - enter a timed comment on the currently playing track \n\t(don't use quotes unless quoting, and no I will not check out your jams if you ask like that...).");
		term.echo("like - like the curretly playing track");
		term.echo("stream - display the tracks in your stream");
	 }   
	term.echo("");
}