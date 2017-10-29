$(document).ready(function() {
	//var username = JSON.stringify('922535821294567425');

	var tweets = document.querySelectorAll('div.tweet');
	var users = {};
	var tweetsy = {};

	// for (var i = 0; i < tweets.length; i++) {
	for (var i = 0; i < 3; i++) {
		var user_id = tweets[i].getAttribute('data-user-id');
		var screen_name = tweets[i].getAttribute('data-screen-name');
		var tweetsy_id = tweets[i].getAttribute('data-tweet-id');
		tweetsy[i] = tweetsy_id;
		users[user_id] = screen_name;
	}

	for (key in users) {
		if (users[key] != null) {
			console.log(users[key]);
			poster(users[key]);
		}
	}

	for (key in tweetsy) {
		if (tweetsy[key] != null) {
			console.log(tweetsy[key]);
			retweeter(tweetsy[key]);
		}
	}

	// thingy(username);

	function poster(name) {
		chrome.runtime.sendMessage({
	        method: 'POST',
	        action: 'xhttp',
	        url: 'http://localhost:5000/is_user_bot',
	        data: JSON.stringify(name)
	    }, function(responseText) {
	    		var tweets = document.querySelectorAll('div.tweet');

    			// for (var i = 0; i < tweets.length; i++) {
					for (var i = 0; i < 3; i++) {
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
	function retweeter(name) {
		chrome.runtime.sendMessage({
	        method: 'POST',
	        action: 'xhttp',
	        url: 'http://localhost:5000/check_post',
	        data: JSON.stringify(name)
	    }, function(responseText) {
	    		var tweets = document.querySelectorAll('div.tweet');

    			// for (var i = 0; i < tweets.length; i++) {
					for (var i = 0; i < 3; i++) {
					var post_id = tweets[i].getAttribute('data-tweet-id');
					if (post_id === name) {
						var node = document.createElement("P");
						var textnode = document.createTextNode(responseText);
						node.appendChild(textnode);
						tweets[i].getElementsByClassName('stream-item-footer')[0].appendChild(node);
					}
				}
	    });
	}
});
