function formatTracks(theListOfTracks, term) {
	(debugMode) ? console.log(theListOfTracks) : 0;
	//output the header
	term.echo("[[;"+ theme['quickIdColor'] +";]Quick Play ID] [[;"+ theme['trackIdColor'] +";]Track ID] [[;"+ theme['artistIdColor'] +";]Artist] Track");
	
	//output the list of tracks
	for (i = 0; i < page_size; i++) {
		streamable = "";
		if (theListOfTracks[i].streamable == true) {
			streamable = "[[;" + theme['streamableTrue'] + ";]true]";
		} else {
			streamable = "[[;" + theme['streamableFalse'] + ";]false]";
		}
		term.echo("[[;"+ theme['quickIdColor'] +";]" + (i+1) + ")] [[;"+ theme['trackIdColor'] +";]" + theListOfTracks[i].id + "] - [[;"+ theme['artistIdColor'] +";]" + theListOfTracks[i].username  + "] - " + theListOfTracks[i].title + " - [[;" + theme['streamableColor'] + ";]streamable:] " + streamable );
		
		(showLinks) ? term.echo('\tlink:' + theListOfTracks[i].permalink_url) : 0;
		
		searchTracks[i] = theListOfTracks[i].id;
	}
}