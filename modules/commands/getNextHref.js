function getNextHref(next_href, term) {
	 //load the next_href
	if (moreArray['tempAPIURL'] == "/me/activities/tracks/affiliated") { // i.e. stream
		//uncomment for debugging
		//term.echo(tracks.next_href + "&" + soundcloudOAuthToken);
		
		moreArray['nextPageURL'] = next_href + "&" + soundcloudOAuthToken;
		console.log("nextPageURL " + moreArray['nextPageURL']);
	} else {
		moreArray['nextPageURL'] = next_href;
		console.log("nextPageURL " + moreArray['nextPageURL']);
	}
	
	//add +1 to the pagination in case "more" is used
	moreArray['page']++;
}