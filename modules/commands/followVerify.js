function followVerify() {
	//this function is not working yet
	SC.get("/users/" + soundcloudUserIdClient + "/followings/" + soundcloudUserId, function(verify, error) {
		if(error) {
			term.echo("Error: " + error.message);
		} else {
			term.echo("Current artist " + verify.username + " successfully followed.");
		}
	});
}