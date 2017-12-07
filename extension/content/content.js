/**
*	Run server api functions
*	Alter Twitter display and inject data
**/

// Signal to light up icon
chrome.runtime.sendMessage({type:'showPageAction'});

chrome.storage.local.get('score', function(items) {
var timeline = document.querySelector('.ProfileTimeline, .content-main');
	if(items.score) {
		timeline.setAttribute('bot-limit', (items.score/100));
	}

	else {
		timeline.setAttribute('bot-limit', 0.4);
	}
});


var checkedUsers = new Map();


//Get blacklist from chrome storage
var bl = [];
chrome.storage.local.get({black: []}, function(items){
	if (items.black) {
		bl = items.black;
	}
});

//Get whitelist from chrome storage
var wl = [];
chrome.storage.local.get({white: []}, function(items){
	if (items.white) {
		wl = items.white;
	}
});


// Prevent parent event activation

function stopPropagation(element) {
	element.onclick = function(event) {
		event.stopPropagation();
	}
}

/**
*	Adds a menu to the badge.
*	@ param {Object} drop - The dropdown menu of the badge.
*	@ param {String} score - The bot score associated with the Tweet.
*/
function addBadgeMenu(drop, score, username) {
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
	buttBot.onclick = function(){
		bl.push(username);
		chrome.storage.local.set({black: bl}, function() {});
	 };

	var liNot = document.createElement('li');
	ul.appendChild(liNot);
	var buttNot = document.createElement('button');
	buttNot.classList.add('dropdown-link');
	buttNot.textContent = 'Mark user as not a bot';
	liNot.appendChild(buttNot);
	buttNot.onclick = function(){
		wl.push(username);
		chrome.storage.local.set({white: wl}, function() {});
	};
}

/**
*type: String -> indicates which badge icon is to be used
*tweet: Div -> the Tweet for which the badge is for
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

/**
*	tweet: Div -> the Tweet for which the mask is for
*	animate: Boolean -> indicates if the mask image should be animated
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

/**
*	usernames: Array -> Array of usernames to process
**/
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

/**
* Check all loaded tweets for bot and add appropriate badges
**/
function checkTimeline() {
	var tweets = document.querySelectorAll('div.ProfileTimeline .tweet, div.content-main .tweet');
	var tl = document.querySelector('.ProfileTimeline, .content-main');
	var usernames = [];


	chrome.runtime.onMessage.addListener(threshold => {
		var timeline = document.querySelector('.ProfileTimeline, .content-main');
		timeline.setAttribute('bot-limit', threshold.value);
	});

	for (var i = 0; i < tweets.length; i++) {
		if (!tweets[i].hasAttribute("bot-score")) {
			addBadge('unchecked', tweets[i]);
			var user_id = tweets[i].getAttribute('data-user-id');
			var screenName = tweets[i].getAttribute('data-screen-name');
			usernames.push(screenName);
			tweets[i].setAttribute('bot-score', '?');
		}
	}
	processUsers(usernames);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Check of the Timeline
setInterval(checkTimeline, 3000);
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

/**
* Add appropriate badges
**/
function processTweets(username, responseText) {
	var tweets = document.querySelectorAll('div.tweet');
	var tl = document.querySelector('.ProfileTimeline, .content-main');


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

			//Check if username is in blacklist
			if (bl.includes(username)) {
				description = 'black';
			}


			//Check if username is in whitelist
			if (wl.includes(username)) {
				description = 'not';
			}


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

			else if (description == 'black') {
				badge.src = chrome.extension.getURL("icons/icon48.png");
				addMask(tweets[i], false);

				description = 'bot: ' + score;

				stopPropagation(badge);
			}

			else if (description === 'not') {
				badge.src = chrome.extension.getURL("icons/checked.png");
				//addClick(badge);
				stopPropagation(badge);
				description = description + ': ' + score;
			}

			var drop = tweets[i].querySelector('#drop');
			drop.style.cursor = 'default';

			addBadgeMenu(drop, description, username);
		}
	}
}

/**
* api call to check poster of tweet
**/
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Section for Like/RT Follow/Follow, injection, modal

// Add Bot Search Result button
$(document.body).append(`<button id="myBtn"><span id='BSRicon'></span></button>`);
// add bot icon to BSR button
var value = document.body.querySelector('#myBtn');
var temp = document.createElement('img');
temp.src = chrome.extension.getURL("icons/icon48.png");
value.innerHTML = `<span id='BSRicon'></span>`;
$(value.querySelector('#BSRicon')).append(temp);

// Modal initialization
var modal = document.createElement('div');
modal.id = 'myModal';
modal.classList.add('mod');
document.body.appendChild(modal);

// close section of modal
var close = document.createElement('div');
close.classList.add('PermalinkProfile-dismiss', 'modal-close-fixed');
modal.appendChild(close);

// close button of modal
var closeIcon = document.createElement('span');
closeIcon.id = 'clo';
closeIcon.classList.add('Icon', 'Icon--close');
close.appendChild(closeIcon)

// content of modal
var con = document.createElement('div');
con.classList.add('mod-content');
modal.appendChild(con);

// Initialize modal contents
var modalTitle = document.createElement('h1');
var purple = document.createElement('a');
var clearButton = document.createElement('button');
var newLine = document.createElement('br');
var searchContent = document.createElement('div');
searchContent.id = 'modalContentDiv';
var textnode = document.createTextNode('Bot Detection Results');
var textnodeButton = document.createTextNode('clear');
modalTitle.appendChild(textnode);
clearButton.appendChild(textnodeButton);
clearButton.id = 'clear';
purple.appendChild(clearButton);
purple.style.float = 'right';
con.appendChild(purple);
con.appendChild(modalTitle);
con.appendChild(newLine);
con.appendChild(searchContent);

// Get the modal
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Clear button in modal
var cbtn = document.getElementById('clear');
// Get the <span> element that closes the modal
var span = document.getElementById("clo");

// Open Modal
btn.onclick = function(event) {
	event.stopPropagation();
	if (event.target.id = 'myBtn') {
		modal.style.display = "block";
	}
}

// Clear Search Results
cbtn.onclick = function(event) {
	if (event.target.id = 'clear') {
		$(searchContent).empty();
	}
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

/**
* Add Search Result info to modal content
**/
function modalContent(results, bot_score) {
	var lines = results.split('|');
	// bot user : score
	var count = 0;
	for (var index = 0; index < lines.length; index++) {
		var line = lines[index].split(':');
		var user = line[0];
		var score = line[1];
		// only add bots to results
		if (score > bot_score) {
			var p = document.createElement('a');
			var s = document.createElement('span');
			var b = document.createElement('br');
			var textnode = document.createTextNode(user);
			p.appendChild(textnode);
			var textnodes = document.createTextNode('score: ' + score);
			s.appendChild(textnodes);
			s.setAttribute('style', 'margin-right:65%;float:right');
			p.href = 'https://twitter.com/'+user;
			searchContent.appendChild(p);
			searchContent.appendChild(s);
			searchContent.appendChild(b);
		}
	}
}

/**
* Check Retweets or Likes on a tweet
**/
function tweet(name, redir) {
	var result;
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: 'http://localhost:5000/check_post/' + redir,
		data: JSON.stringify(name)
	}, function(responseText) {
		var arr = responseText.split('|');
		// tweet heading
		var h = document.createElement('h3');
		var b = document.createElement('br');
		var textnode = document.createTextNode('(' + redir + ') ' + name);
		h.appendChild(textnode);
		searchContent.appendChild(b);
		searchContent.appendChild(h);
		result = arr[0];
		// insert into modal
		if(result > 0) {
			for (var index = 2; index < arr.length -1; index++) {
				modalContent(arr[index], arr[1]);
			}
		}
		else {
			var p = document.createElement('p');
			var b = document.createElement('br');
			var textnode = document.createTextNode('No bots found');
			p.appendChild(textnode);
			searchContent.appendChild(p);
			searchContent.appendChild(b);
		}
		if (result !== undefined) inject(result, name, redir);
	});
}

/**
* Check Followers or Following on a profile page or timeline
**/
function follow(name, redir) {
	var result;
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: 'http://localhost:5000/follow/' + redir,
		data: JSON.stringify(name)
	}, function(responseText) {
		var arr = responseText.split('|');
		// tweet heading
		var h = document.createElement('h3');
		var b = document.createElement('br');
		var textnode = document.createTextNode('(' + redir + ') ' + name);
		h.appendChild(textnode);
		searchContent.appendChild(b);
		searchContent.appendChild(h);
		result = arr[0];
		// insert into modal
		if(result > 0) {
			for (var index = 2; index < arr.length -1; index++) {
				modalContent(arr[index], arr[1]);
			}
		}
		else {
			var p = document.createElement('p');
			var b = document.createElement('br');
			var textnode = document.createTextNode('No bots found');
			p.appendChild(textnode);
			searchContent.appendChild(p);
			searchContent.appendChild(b);
		}
		if (result !== undefined) inject(result, name ,redir);
	});
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Front-End Inject
function inject(val, tweetID, act) {
	if (act === 'Retweets') {
		var tw = document.querySelector('div.tweet[data-tweet-id="'+tweetID+'"]');
		var stop = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButton .IconContainer');
		stop.classList.remove('spin');
		var stop2 = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButtonUndo .IconContainer');
		stop2.classList.remove('spin');
		removeElement('loading3');
		// var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButton .ProfileTweet-actionCount');
		var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButton');
		if ( $(ele).css('display') == 'inline-block' ) {
			ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButton .ProfileTweet-actionCount');
			var old_val = ele.querySelector('.ProfileTweet-actionCount .ProfileTweet-actionCountForPresentation').innerHTML
			var bots = ele.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true">${old_val}</span> <button class='js-tooltip' data-original-title="bot count" id='myBtn2' style='display:inline'>(${val} detected) </button>`;
		}
		else {
			var ele2 = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButtonUndo .ProfileTweet-actionCount');
			var old_val2 = ele2.querySelector('.ProfileTweet-actionCountForPresentation').innerHTML
			var bots2 = ele2.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true">${old_val2}</span> <button class='js-tooltip' data-original-title="bot count" id='myBtn2' style='display:inline'>(${val} detected) </button>`;
		}
	}
	else if (act === 'Likes') {
		var tw = document.querySelector('div.tweet[data-tweet-id="'+tweetID+'"]');
		var stop = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButton .IconContainer');
		stop.classList.remove('spin');
		var stop2 = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo .IconContainer');
		stop2.classList.remove('spin');
		removeElement('loading4');
		var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButton');
		if ( $(ele).css('display') == 'inline-block' ) {
			ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButton .ProfileTweet-actionCount');
			var old_val = ele.querySelector('.ProfileTweet-actionCount .ProfileTweet-actionCountForPresentation').innerHTML
			var bots = ele.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true">${old_val}</span> <button class='js-tooltip' data-original-title="bot count" id='myBtn2' style='display:inline'>(${val} detected) </button>`;
		}
		else {
			var ele2 = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo .ProfileTweet-actionCount');
			var old_val2 = ele2.querySelector('.ProfileTweet-actionCountForPresentation').innerHTML
			var bots2 = ele2.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true">${old_val2}</span> <button class='js-tooltip' data-original-title="bot count" id='myBtn2' style='display:inline'>(${val} detected) </button>`;
		}
	}
	else if (act === 'Followers') {
		var ur = window.location.pathname;
		var prof = ur.split("/").slice(-1)[0];
		removeElement('loading1');
		// on profile
		if (prof) {
			var ele = document.querySelector('.ProfileNav .ProfileNav-list .ProfileNav-item--followers .ProfileNav-stat');
			var old_val = ele.querySelector('.ProfileNav-value').innerHTML;
			var bots = ele.innerHTML = `<span class="ProfileNav-label" aria-hidden="true">Followers</span> <span class="ProfileNav-value" data-is-compact="false">${old_val} <p class='js-tooltip' data-original-title="bot count" style='display:inline'>(${val})</p></span>`;
		}
		// on home
		else {
			var ele = document.querySelector('.DashboardProfileCard-content .ProfileCardStats .ProfileCardStats-statList');
			var li = ele.querySelectorAll('.ProfileCardStats-stat')[2];
			var lio = li.querySelector('.ProfileCardStats-statLink .ProfileCardStats-statValue');
			var old_val = lio.innerHTML;
			var bots = lio.innerHTML = `<span class="ProfileCardStats-statValue" data-is-compact="false">${old_val} <p class='js-tooltip' data-original-title="bot count" style='display:inline'>(${val})</p></span>`;
		}
	}
	else if (act === 'Following') {
		var ur = window.location.pathname;
		var prof = ur.split("/").slice(-1)[0];
		removeElement('loading2');
		// on profile
		if (prof) {
			var ele = document.querySelector('.ProfileNav .ProfileNav-list .ProfileNav-item--following .ProfileNav-stat');
			var old_val = ele.querySelector('.ProfileNav-value').innerHTML;
			var bots = ele.innerHTML = `<span class="ProfileNav-label" aria-hidden="true">Following</span> <span class="ProfileNav-value" data-is-compact="false">${old_val} <p class='js-tooltip' data-original-title="bot count" style='display:inline'>(${val})</p></span>`;
		}
		// on home
		else {
			var ele = document.querySelector('.DashboardProfileCard-content .ProfileCardStats .ProfileCardStats-statList');
			var li = ele.querySelectorAll('.ProfileCardStats-stat')[1];
			var lio = li.querySelector('.ProfileCardStats-statLink .ProfileCardStats-statValue');
			var old_val = lio.innerHTML;
			var bots = lio.innerHTML = `<span class="ProfileCardStats-statValue" data-is-compact="false">${old_val} <p class='js-tooltip' data-original-title="bot count" style='display:inline'>(${val})</p></span>`;
		}
	}
}
