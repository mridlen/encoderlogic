if(cmd.split(" ")[0] == 'dir') {
		$.getJSON( "modules/directory_listing.php", function (dir) {
			alert(dir[0]);
		});
	}