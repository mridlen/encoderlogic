function formatTracks(theListOfTracks, term) {
	console.log(theListOfTracks);
	//output the header
	term.echo("[[;"+ theme['quickIdColor'] +";]Quick Play ID] [[;"+ theme['trackIdColor'] +";]Track ID] [[;"+ theme['artistIdColor'] +";]Artist] Track");
	
	//output the list of tracks
	for (i = 0; i < page_size; i++) {
		term.echo("[[;"+ theme['quickIdColor'] +";]" + (i+1) + ")] [[;"+ theme['trackIdColor'] +";]" + theListOfTracks[i].id + "] - [[;"+ theme['artistIdColor'] +";]" + theListOfTracks[i].username  + "] - " + theListOfTracks[i].title);
		if (showLinks == 1) {
			term.echo('\tlink:' + theListOfTracks[i].permalink_url);
		}
		searchTracks[i] = theListOfTracks[i].id;
	}
}