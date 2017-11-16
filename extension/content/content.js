// Signal to light up icon
chrome.runtime.sendMessage({type:'showPageAction'});

/*
type: String -> indicates which badge icon is to be used
tweet: Div -> the Tweet for which the badge is for
*/
function addBadge(type, tweet) {
	var badge = document.createElement('img');

	if (type === 'bot') {
		badge.src = chrome.extension.getURL("icons/icon.png");
	}
	else if (type === 'not') {
		badge.src = chrome.extension.getURL("icons/checked.png");
	}
	else {
		badge.src = chrome.extension.getURL("icons/unchecked.png");
	}

	badge.classList.add('avatar', 'badge', 'spin');
	tweet.querySelector('div.stream-item-header').appendChild(badge);
}

/*
tweet: Div -> the Tweet for which the mask is for
animate: Boolean -> indicates if the mask image should be animated
*/
function addMask(tweet, animate) {
	var mask = document.createElement('div');
	mask.classList.add('bot');
	tweet.appendChild(mask);

	var image = document.createElement('img');
	image.src = chrome.extension.getURL("icons/icon48.png");
	image.classList.add('center');
	mask.appendChild(image);

	if (animate) {
		image.classList.add('spin');
	}
}

var users = {};
var tweetsy = {};

function processUsers(users) {
	for (key in users) {
		if (users[key] != null) {
			console.log(users[key]);
			poster(users[key]);
		}
	}
}

function checkTimeline() {
	var tweets = document.querySelectorAll('div.tweet');


	if (tweets.length > 10) {
		for (var i = 0; i < tweets.length; i++) {
			if (!tweets[i].hasAttribute("bot-score")) {
				addBadge('unchecked', tweets[i]);

				var user_id = tweets[i].getAttribute('data-user-id');
				var screen_name = tweets[i].getAttribute('data-screen-name');
				var tweetsy_id = tweets[i].getAttribute('data-tweet-id');
				tweetsy[i] = tweetsy_id;
				users[user_id] = screen_name;

				poster(screen_name);

				tweets[i].setAttribute('bot-score', '?')
			}
		}

		// processUsers(users);
	}
}

setInterval(checkTimeline, 1000);

function poster(name) {
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/is_user_bot',
        data: JSON.stringify(name),
    },
    function(responseText) {
    		var tweets = document.querySelectorAll('div.tweet');

			for (var i = 0; i < tweets.length; i++) {
				var screen_name = tweets[i].getAttribute('data-screen-name');

				if (screen_name === name && tweets[i].getAttribute('bot-score') == '?') {
					tweets[i].setAttribute('bot-score', responseText);

					if (responseText === 'bot') {
						var verified = tweets[i].querySelector('span.Icon.Icon--verified');

						var badge = tweets[i].querySelector('.stream-item-header .badge');
						if (verified === null) {
							badge.src = chrome.extension.getURL("icons/icon48.png");
						}
						else {
							badge.src = chrome.extension.getURL("icons/checked.png");
						}
							badge.classList.remove('spin');

						badge.onclick = function(event) {
							if (event.target.classList.contains("badge")) {
								if (event.target.src.includes("icon48.png")) {
									event.target.src = chrome.extension.getURL("icons/checked.png");
								}
								else {
									event.target.src = chrome.extension.getURL("icons/icon48.png");
								}
							}
							event.stopPropagation();
						}

						addMask(tweets[i], false);
					}
					else if (responseText === 'not') {
						var badge = tweets[i].querySelector('.stream-item-header .badge');
						badge.src = chrome.extension.getURL("icons/checked.png");
						badge.classList.remove('spin');

						badge.onclick = function(event) {
							if (event.target.classList.contains("badge")) {
								if (event.target.src.includes("icon48.png")) {
									event.target.src = chrome.extension.getURL("icons/checked.png");
								}
								else {
									event.target.src = chrome.extension.getURL("icons/icon48.png");
								}
							}
							event.stopPropagation();
						}
					}
					else {
						var badge = tweets[i].querySelector('.stream-item-header .badge');
						badge.classList.remove('spin');
					}
				}
			}
    });
}
