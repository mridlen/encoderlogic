function listTracks(arg0) {
	//clear searchTracks[]
	searchTracks = [];
	
	//first we need to split depending on if tracks/search or more is used
	//we will be dumping the list of tracks into theListOfTracks
	if (arg0 != 'more') { //arg0 == 'stream' || arg0 == 'tracks'
		if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
			listTracksStream();
		} else {
			listTracksTracks();
		}
	} else { //arg0 == 'more'
	//the only reason we care if arg0 == 'more' is because we have use a different method to query the API
		if(moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") {
			moreTracksStream();
		} else {
			moreTracksTracks();
		}
	}
}