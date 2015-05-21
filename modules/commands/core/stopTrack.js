function stopTrack(term){
	term.echo("Stopping track.");
	
	//stop all timed comments (had to switch from i to stopI due to a for loop collision :-P)
	for (stopI = 0; stopI < timeoutValue.length; stopI++)
	{
		clearTimeout(timeoutValue[stopI]);
	}
	timeoutValue = [];
	//stop all sounds playing using soundManager (soundcloud uses this)
	soundManager.stopAll();
}