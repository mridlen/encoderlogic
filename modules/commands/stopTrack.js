function stopTrack(){
	term.echo("Stopping track.");
	
	//stop all timed comments
	for (i = 0; i < timeoutValue.length; i++)
	{
		clearTimeout(timeoutValue[i]);
	}
	timeoutValue = [];
	//stop all sounds playing using soundManager (soundcloud uses this)
	soundManager.stopAll();
}