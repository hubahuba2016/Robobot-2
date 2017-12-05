// Signal to light up icon
chrome.runtime.sendMessage({type:'showPageAction'});

var checkedUsers = new Map();

function stopPropagation(element) {
	element.onclick = function(event) {
		event.stopPropagation();
	}
}

/**
 *	Adds a menu to the badge.
 *	@param {Object} drop - The dropdown menu of the badge.
 *	@param {String} score - The bot score associated with the Tweet.
 */
function addBadgeMenu(drop, score) {
	var dropdownContent = document.createElement('div');
	dropdownContent.classList.add('badge-content', 'dropdown-menu');
	drop.appendChild(dropdownContent);
	var aScore = document.createElement('span');
	//aScore.classList.add('dropdown-link', 'inactive-link');
	aScore.classList.add('description');
	stopPropagation(aScore);
	aScore.innerHTML = score;
	dropdownContent.appendChild(aScore);
	var ul = document.createElement('ul');
	dropdownContent.appendChild(ul);

	var liBot = document.createElement('li');
	ul.appendChild(liBot);
	var buttBot = document.createElement('button');
	buttBot.classList.add('dropdown-link');
	buttBot.textContent = 'Mark user as a bot';
	liBot.appendChild(buttBot);

	var liNot = document.createElement('li');
	ul.appendChild(liNot);
	var buttNot = document.createElement('button');
	buttNot.classList.add('dropdown-link');
	buttNot.textContent = 'Mark user as not a bot';
	liNot.appendChild(buttNot);
}

/*
type: String -> indicates which badge icon is to be used
tweet: Div -> the Tweet for which the badge is for
*/
function addBadge(type, tweet) {
	// Create badge
	var wrapper = document.createElement('div');
	wrapper.classList.add('avatar', 'badge-wrapper');
	wrapper.style.pointerEvents = 'none';


	var drop = document.createElement('div');
	drop.id = 'drop';
	drop.classList.add('dropdown');
	wrapper.appendChild(drop);

	var badge = document.createElement('img');
	badge.id = 'badge';
	badge.classList.add('badge', 'dropbtn', 'spin');
	badge.style.pointerEvents = 'auto';
	drop.appendChild(badge);
	tweet.querySelector('div.stream-item-header').appendChild(wrapper);

	// Assign correct icon image to badge
	if (type === 'bot') {
		badge.src = chrome.extension.getURL("icons/icon.png");
	}
	else if (type === 'not') {
		badge.src = chrome.extension.getURL("icons/checked.png");
	}
	else {
		badge.src = chrome.extension.getURL("icons/unchecked.png");
	}
}

/*
tweet: Div -> the Tweet for which the mask is for
animate: Boolean -> indicates if the mask image should be animated
*/
function addMask(tweet, animate) {
	// Create the mask
	var mask = document.createElement('div');
	// Add class to mask for styling
	mask.classList.add('bot');
	// Add mask to the Tweet
	tweet.appendChild(mask);

	// Create the icon
	var image = document.createElement('img');
	// Assign the correct icon to the icon
	image.src = chrome.extension.getURL("icons/icon48.png");
	// Add class to icon to center it
	image.classList.add('center');
	// Add the icon to the mask
	mask.appendChild(image);

	// Animate the icon if specified
	if (animate) {
		image.classList.add('spin');
	}
}

/*
usernames: Array -> Array of usernames to process
*/
function processUsers(usernames) {
	for (username of usernames) {
		if (!checkedUsers.has(username)) {
			checkedUsers.set(username, '?');
			poster(username);
		}
		else if (checkedUsers.get(username) !== '?') {
			processTweets(username, checkedUsers.get(username));
		}
	}
}

function checkTimeline() {
	var tweets = document.querySelectorAll('div.ProfileTimeline .tweet, div.content-main .tweet');
	var usernames = [];

	console.log(checkedUsers);

	// for (var i = 0; i < tweets.length; i++) {
	// 	if (!tweets[i].hasAttribute("bot-score")) {
	// 		addBadge('unchecked', tweets[i]);
	// 		var user_id = tweets[i].getAttribute('data-user-id');
	// 		var screenName = tweets[i].getAttribute('data-screen-name');
	// 		usernames.push(screenName);
	// 		tweets[i].setAttribute('bot-score', '?');
	// 	}
	// }

	processUsers(usernames);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Check of the Timeline
setInterval(checkTimeline, 500);
// Find the Tweet stream of the Timeline
var target = document.querySelector('ol#stream-items-id.stream-items.js-navigable-stream');
//var target = document.querySelector('div[data-test-selector="ProfileTimeline"]');
if (target !== null) {
	// Create an observer to listen for mutations in the Timeline
	var observer = new MutationObserver(checkTimeline);
	// Specify configuration options of the observer
	var config = { attributes: true, childList: true, characterData: true };
	// Pass in the target node and the observer options
	observer.observe(target, config);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processTweets(username, responseText) {
	var tweets = document.querySelectorAll('div.tweet');

	// function addClick(badge) {
	// 	badge.onclick = function(event) {
	// 		event.stopPropagation();

	// 		// if (event.target.classList.contains("badge")) {
	// 		// 	if (event.target.src.includes("icon48.png")) {
	// 		// 		event.target.src = chrome.extension.getURL("icons/checked.png");
	// 		// 	}
	// 		// 	else {
	// 		// 		event.target.src = chrome.extension.getURL("icons/icon48.png");
	// 		// 	}
	// 		// }
	// 	}
	// }

	for (var i = 0; i < tweets.length; i++) {
		var screenName = tweets[i].getAttribute('data-screen-name');

		if (screenName === username && tweets[i].getAttribute('bot-score') == '?') {

			var score = '?';
			var description = '?';

			if (responseText) {
				score = responseText.score;
				description = responseText.description;
			}

			// var badge = tweets[i].querySelector('.stream-item-header .badge');
			var badge = tweets[i].querySelector('#badge');
			badge.classList.remove('spin');

			tweets[i].setAttribute('bot-score', score);

			if (description === 'bot') {
				var verified = tweets[i].querySelector('span.Icon.Icon--verified');

				if (verified === null) {
					badge.src = chrome.extension.getURL("icons/icon48.png");
					addMask(tweets[i], false);

					description = description + ': ' + score;
				}
				else {
					badge.src = chrome.extension.getURL("icons/checked.png");
					description = description + ': ' + score + ' (verified)';
				}

				//addClick(badge);
				stopPropagation(badge);
			}
			else if (description === 'not') {
				badge.src = chrome.extension.getURL("icons/checked.png");
				//addClick(badge);
				stopPropagation(badge);
			}

			var drop = tweets[i].querySelector('#drop');
			drop.style.cursor = 'default';

			addBadgeMenu(drop, description);
		}
	}
}

function poster(username) {
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/is_user_bot',
        data: JSON.stringify(username),
    },
    function(responseText) {
    	if (responseText) {
    		checkedUsers.set(username, responseText);
    		processTweets(username, responseText);
    	}
    	else {
    		checkedUsers.delete(username)
    		processTweets(username, responseText);
    	}
    });
}
