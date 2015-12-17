commands.push({
    triggers: [
        {
            trigger: "ten",
            alias: ["Ten Forward", "Ten forward", "TEN FORWARD"],
            help: "ten forward ............ Play the Ten Forward album.",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
		term.echo("Ten Forward Album loading...");
		//queue is exactly like play except that we use the queueTrack instead of playTrack function
		//"queue" is ingeniously supplied in cmd.split(" ")[0] so that what the user typed is actually supplied to the "queue help" or "play help" menu
		//
		/*
		queueTrack(233067171, term);
		queueTrack(233067294, term);
		queueTrack(233067471, term);
		queueTrack(233067603, term);
		queueTrack(233067706, term);
		queueTrack(233067896, term);
		queueTrack(233068022, term);
		queueTrack(233068213, term);
		queueTrack(233068313, term);
		queueTrack(233068668, term);
		queueTrack(233068879, term);
		*/

		queue.push(233067171);
		queue.push(233067294);
		queue.push(233067471);
		queue.push(233067603);
		queue.push(233067706);
		queue.push(233067896);
		queue.push(233068022);
		queue.push(233068213);
		queue.push(233068313);
		queue.push(233068668);
		queue.push(233068879);
		
		term.echo("Ten Forward has been queued. Type \"play\" to listen.");
	}
});
