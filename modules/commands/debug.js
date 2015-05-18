commands.push({
    triggers: [
        {
            trigger: "debug",
            alias: ["d", "de", "deb", "debu"],
            help: "debug [on|off] ......... turn debug mode on or off (for development purposes)",
            requireLoggedIn: false
        }
    ],

	fn: function (trigger, term, cmd) {
		status = cmd.split(" ")[1];
		if (status == "on" || status == "1") {
			debugMode = 1;
			term.echo("Debug mode: on");
		} else if (status == "off" || status == "0") {
			debugMode = 0;
			term.echo("Debug mode: off");
		} else if (typeof cmd.split(" ")[1] == "undefined") {
			if (debugMode == 1) {
				term.echo("Debug mode: on");
			} else {
				term.echo("Debug mode: off");
			}
		} else {
			term.echo("Invalid debug mode status (must be [on|1] or [off|0]).");
		}
	}
});