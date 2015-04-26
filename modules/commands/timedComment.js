//output timed comments to screen based on timestamp data
function timedComment(iteration, timestamp, username, body, term) {
	//iteration is passed to give unique timeouts to each comment
	timeoutValue[iteration] = setTimeout(function() {
		term.echo("[" + timestamp + "] " + username + ": " + body);
	}, timestamp);
}