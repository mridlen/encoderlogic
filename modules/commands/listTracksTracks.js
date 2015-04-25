function listTracksTracks() {
	var theListOfTracks = [];
	SC.get(moreArray['tempAPIURL'], { limit: page_size, linked_partitioning: 1 }, function (tracks) {
		for (i = 0; i < page_size; i++) {
			theListOfTracks[i] = {
				id: tracks.collection[i].id,
				username: tracks.collection[i].user.username,
				title: tracks.collection[i].title,
				permalink_url: tracks.collection[i].permalink_url
			};
		}
		formatTracks(theListOfTracks);
		getNextHref(tracks.next_href);
	});
}