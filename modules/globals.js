// initialize client with app credentials
SC.initialize({
  client_id: '8c3cf644ea6051b32f5e612143e203e9',
  redirect_uri: 'http://beta.encoderlogic.com/callback.html'
});
//soundcloud user id (this is associated with the artist, not the end user)
var soundcloudUserId = 14947567;
var soundcloudUserName = "Encoder Logic";

//this is used for the "soundcloud" command
var soundcloudURL = "http://soundcloud.com/encoder-logic";

//this is used for the "facebook" command
var facebookURL = "http://facebook.com/encoder-logic";

//the client is for the connecting user (the one who is looking at the webpage)
var soundcloudUserIdClient = 0;
var soundcloudUserNameClient = "anonymous";
//OAuth Token... I hate to have to store it in a variable but accessing the stream next_href requires it for some odd reason
//format is "oauth_token=xxxx"
var soundcloudOAuthToken = "";

//track limit (increase if your soundcloud has more sounds than the track limit)
var trackLimit = 300;

//setting the page size default here (for pagination purposes)
var page_size = 20;

//theme used for color formatting
var theme = {
    quickIdColor: "cyan",
    trackIdColor: "red",
    artistIdColor: "yellow",
	streamableColor: "grey",
	streamableTrue: "green",
	streamableFalse: "red"
}

//more array contains the info needed to use the tracks command and then type "more" for the next page
var moreArray = {
    //I'm using this variable to build the API URL string e.g. "/users/12345/tracks" (not sure if this is going to be needed in the future)
    tempAPIURL: "",
    //page is like the "i" variable to track the pagination
    page: 0,
    //this holds the next_href which is used for pulling up the next page
    nextPageURL: ""
};

//boolean loggedIn will return 1 once successfully logged in
//by default it is 0
var loggedIn = 0;

// initiate auth popup
//SC.connect(function() {
//  SC.get('/me', function(me) { 
//    alert('Hello, ' + me.username); 
//  });
//});

//queue holds the track_ids that are pending on the playlist
var queue = [];
//queue strings holds the formatted strings from the queue
var queueStrings = [];
//queue loop boolean - if 1 will loop the queue instead of retiring played tracks, default 0 (off)
var queueLoop = 0;
//repeat, boolean - if 1 it will loop the track instead of moving on the next track, default is 0 (off)
var repeat = 0;
//showLinks, boolean - if 0 it will not display links, default is 1 (on)
var showLinks = 1;

var followers_ids = [];
var currentTrack = {
    trackId: 0,
    trackArtist: "",
    trackName: "",
    trackDuration: 0,
    startedTimestamp: 0,
    trackPosition: 0
};

//timeoutValue array has the timeouts for all the comments
var timeoutValue = [];

//searchTracks array holds the trackIds of the recent search
var searchTracks = [];

//searchArtists array holds the userIds of the recent artist search
var searchArtists = [];

//this holds the relevant properties of the track object
//var theListOfTracks = [];

//for comment posting
var commentTimestamp = 0;
var postUrl = "";
var bodyString = "";

//boolean debugMode - if on it will output things to the console (default off)
var debugMode = 0;