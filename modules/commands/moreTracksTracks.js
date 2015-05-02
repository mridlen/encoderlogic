function moreTracksTracks(term) {
	var theListOfTracks = [];
	$.getJSON(moreArray['nextPageURL'], function( tracks ) {
		for (i = 0; i < page_size; i++) {
			theListOfTracks[i] = {
				id: tracks.collection[i].id,
				username: tracks.collection[i].user.username,
				title: tracks.collection[i].title,
				permalink_url: tracks.collection[i].permalink_url,
				streamable: tracks.collection[i].streamable
			};
		}
		formatTracks(theListOfTracks, term);
		getNextHref(tracks.next_href, term);
	});
}