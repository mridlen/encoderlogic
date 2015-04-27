function getQueue(term) {
    term.echo("");
	term.echo("=== " + queue.length + " TRACKS QUEUED ===");
	term.echo("");

    for (i = 0; i < queue.length; i++) {
        queueDisplay(i, queue[i], term);
    }
	
    term.echo("");
}