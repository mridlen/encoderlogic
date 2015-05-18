commands.push({
    triggers: [
        {
            trigger: "repeat",
            alias: ["r", "re", "rep", "repe", "repea"],
            help: "repeat ................. turn track repeat on or off using 'repeat on' or 'repeat off' (alternatively use 1 or 0 e.g. 'repeat 1').",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		status = cmd.split(" ")[1];
		if (status == 'on' || status == 1) {
			//turn repeat on
			repeat = 1;
			term.echo("Repeat: on");
		} else if (status == 'off' || status == 0) {
			//turn repeat off
			repeat = 0;
			term.echo("Repeat: off");
		} else {
			if (repeat == 0) {
				term.echo("Repeat: off");
			} else if (repeat == 1) {
				term.echo("Repeat: on");
			}
		}
	}
});