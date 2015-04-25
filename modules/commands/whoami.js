//the whoami function may be deprecated because the user name is displayed via the command prompt
function whoami() {
	SC.get("/me", function(me){
		term.echo("User: " + me.username);
	});
}