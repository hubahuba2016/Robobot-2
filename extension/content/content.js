// send to server ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// TESTING SECTION
// check profile to be inserted as parameter
var url = window.location.pathname;
var profile = url.split("/").slice(-1)[0];
if (profile === undefined || profile === '') {
	var ur = document.querySelector('.DashboardProfileCard-content .DashboardProfileCard-userFields .DashboardProfileCard-screenname .DashboardProfileCard-screennameLink .username .u-linkComplex-target').innerHTML;
	profile = ur;
}
// Called to force testing
tweet('930647090933493760', 'Retweets');
tweet('930647090933493760', 'Likes');
// tweet('926553250064687109', 'Retweets');
// tweet('926553250064687109', 'Likes');
follow(profile, 'Followers');
follow(profile, 'Following');

// Check Retweets or Likes on a tweet
function tweet(name, redir) {
	console.log(`running tweet(${name}, ${redir})`);
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/check_post/' + redir,
        data: JSON.stringify(name)
    }, function(responseText) {
			var result = responseText;
			console.log(`TWEET result: ${result}`);
			if (result !== undefined) inject(result, '926553250064687109', redir);
    });
}

// Check Followers or Following on a profile page or timeline
function follow(name, redir) {
	console.log(`running follow(${name}, ${redir})`);
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/follow/' + redir,
        data: JSON.stringify(name)
    }, function(responseText) {
			var result = responseText;
			console.log(`FOLLOW result: ${result}`);
			if (result !== undefined) inject(result, '' ,redir);
    });
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Front-End Inject
function inject(val, tweetID, act) {
	if (act === 'Retweets') {
		var tw = document.querySelector('div.tweet[data-tweet-id="'+tweetID+'"]');
		var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButton .ProfileTweet-actionCount');
		var old_val = ele.querySelector('.ProfileTweet-actionCountForPresentation').innerHTML
		var bots = ele.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"> ${val}/${old_val}</span>`;
	}
	else if (act === 'Likes') {
		var tw = document.querySelector('div.tweet[data-tweet-id="'+tweetID+'"]');
		var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButton .ProfileTweet-actionCount');
		var old_val = ele.querySelector('.ProfileTweet-actionCountForPresentation').innerHTML
		var bots = ele.innerHTML = `<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true"> ${val}/${old_val}</span>`;
	}
	else if (act === 'Followers') {
		var ur = window.location.pathname;
		var prof = ur.split("/").slice(-1)[0];
		// on profile
		if (prof) {
			var ele = document.querySelector('.ProfileNav .ProfileNav-list .ProfileNav-item--followers .ProfileNav-stat');
			var old_val = ele.querySelector('.ProfileNav-value').innerHTML;
			var bots = ele.innerHTML = `<span class="ProfileNav-label" aria-hidden="true">Followers</span> <span class="ProfileNav-value" data-is-compact="false">${val}/${old_val}</span>`;
		}
		// on home
		else {
			var ele = document.querySelector('.DashboardProfileCard-content .ProfileCardStats .ProfileCardStats-statList');
			var li = ele.querySelectorAll('.ProfileCardStats-stat')[2];
			var lio = li.querySelector('.ProfileCardStats-statLink .ProfileCardStats-statValue');
			var old_val = lio.innerHTML;
			var bots = lio.innerHTML = `<span class="ProfileCardStats-statValue" data-is-compact="false">${val}/${old_val}</span>`;
		}
	}
	else if (act === 'Following') {
		var ur = window.location.pathname;
		var prof = ur.split("/").slice(-1)[0];
		// on profile
		if (prof) {
			var ele = document.querySelector('.ProfileNav .ProfileNav-list .ProfileNav-item--following .ProfileNav-stat');
			var old_val = ele.querySelector('.ProfileNav-value').innerHTML;
			var bots = ele.innerHTML = `<span class="ProfileNav-label" aria-hidden="true">Following</span> <span class="ProfileNav-value" data-is-compact="false">${val}/${old_val}</span>`;
		}
		// on home
		else {
			var ele = document.querySelector('.DashboardProfileCard-content .ProfileCardStats .ProfileCardStats-statList');
			var li = ele.querySelectorAll('.ProfileCardStats-stat')[1];
			var lio = li.querySelector('.ProfileCardStats-statLink .ProfileCardStats-statValue');
			var old_val = lio.innerHTML;
			var bots = lio.innerHTML = `<span class="ProfileCardStats-statValue" data-is-compact="false">${val}/${old_val}</span>`;
		}
	}
}
