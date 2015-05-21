commands.push({
    triggers: [
        {
            trigger: "playlist",
            alias: ["playl", "plali", "plalis"],
            help: "playlist Name .......... create a playlist with the current playing track and queue.",
            requireLoggedIn: true
        }
    ],

	fn: function (trigger, term, cmd) {
		if(typeof cmd.split(" ")[1] == "undefined") {
            term.echo("Please specify a playlist name.\n");
            term.echo("Syntax: playlist Name of Playlist");
        } else {
            var tempQueue = queue.map(function(id) {
                return { id: id }
            });
            
            //split on space, remove the 0th element, and join back into a string
            var playlistArray = cmd.split(" ");
            playlistArray.splice(0, 1);
            var playlistName = playlistArray.join(" ");
            
            console.log(playlistName);
            var tempPlaylist = {
                title: playlistName,
                tracks: tempQueue
            };
            console.log(tempPlaylist);
            SC.post('/playlists', {
                playlist: tempPlaylist
            }, function (error) {
                console.log(error);
            });
        }
	}
});