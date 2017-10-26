$(document).ready(function() {
	//var username = JSON.stringify('922535821294567425');

	var tweets = document.querySelectorAll('div.tweet');
	var users = {};

	for (var i = 0; i < tweets.length; i++) {
		var user_id = tweets[i].getAttribute('data-user-id');
		var screen_name = tweets[i].getAttribute('data-screen-name');
		users[user_id] = screen_name;
	}

	for (key in users) {
		console.log(users[key]);
		thingy(users[key]);
	}

	// thingy(username);

	function thingy(name) {
		chrome.runtime.sendMessage({
	        method: 'POST',
	        action: 'xhttp',
	        url: 'http://localhost:5000/is_user_bot',
	        data: JSON.stringify(name)
	    }, function(responseText) {
	    		var tweets = document.querySelectorAll('div.tweet');

    			for (var i = 0; i < tweets.length; i++) {
					var screen_name = tweets[i].getAttribute('data-screen-name');
					if (screen_name === name) {
						var node = document.createElement("P");
						var textnode = document.createTextNode(responseText);
						node.appendChild(textnode);              
						node.style.display = 'inline';
						tweets[i].getElementsByClassName('stream-item-header')[0].appendChild(node);
					}
				}
	    });
	}
});	