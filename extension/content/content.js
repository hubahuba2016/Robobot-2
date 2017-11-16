var tweets = document.querySelectorAll('div.tweet');
var users = {};
var tweetsy = {};

for (var i = 0; i < tweets.length; i++) {
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

function poster(name) {
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

					if (responseText ==='bot') {
						var verified = tweets[i].querySelector('span.Icon.Icon--verified');

						if (verified === null) {
							var group = tweets[i].querySelector('.account-group.js-account-group.js-action-profile.js-user-profile-link.js-nav');

							var avatar = tweets[i].querySelector('.avatar.js-action-profile-avatar');

							var badge = document.createElement('img');
							badge.id = 'badge';
							badge.src = chrome.extension.getURL("icons/badge.png");
							badge.classList.add('avatar');
							badge.classList.add('badge');

							var wrapper = document.createElement('div');
							group.insertBefore(wrapper, group.firstChild);
							wrapper.appendChild(avatar);
							wrapper.appendChild(badge);
						}
					}	
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

			for (var i = 0; i < tweets.length; i++) {
				var post_id = tweets[i].getAttribute('data-tweet-id');
				if (post_id === name) {
					var node = document.createElement("P");
					var textnode = document.createTextNode(responseText);
					node.appendChild(textnode);
					node.style.display = 'inline';
					tweets[i].querySelector('.stream-item-footer').appendChild(node);
				}
			}
    });
}
