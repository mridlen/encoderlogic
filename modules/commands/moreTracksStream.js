function moreTracksStream() {
	var theListOfTracks = [];
	$.getJSON(moreArray['nextPageURL'], function( tracks ) {
		for (i = 0; i < page_size; i++) {
			theListOfTracks[i] = {
				id: tracks.collection[i].origin.id,
				username: tracks.collection[i].origin.user.username,
				title: tracks.collection[i].origin.title,
				permalink_url: tracks.collection[i].origin.permalink_url
			};
		}
		formatTracks(theListOfTracks);
		getNextHref(tracks.next_href);
	});
}