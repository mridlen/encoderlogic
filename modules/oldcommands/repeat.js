function repeatModify(status, term) {
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