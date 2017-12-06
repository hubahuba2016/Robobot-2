/**
*	Highlight function
*	Clicking highlighted runs corresponding function by calling api
**/

//~~~~~~~~~~~~~~~HIGHLIGHT ELEMENTS START~~~~~~~~~~~~~~~~~~~~~~~~~~~
var observer = null;

// Check if on profile page
function checkProfile() {
	var url = window.location.pathname;
	var profile = url.split("/").slice(-1)[0];
	if (profile === undefined || profile === '') {
		var ur = document.querySelector('.DashboardProfileCard-content .DashboardProfileCard-userFields .DashboardProfileCard-screenname .DashboardProfileCard-screennameLink .username .u-linkComplex-target').innerHTML;
		profile = ur;
	}
	return profile;
}

// mouse hover color
function mouseOver() {
	this.style.setProperty ("background-color", "#ff9933", "important");
}

// no long hovering color
function mouseOut() {
	this.style.setProperty ("background-color", "lightblue", "important");
}

// remove specific element
function removeElement(elementId) {
	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
}

// Clicked highlighted follower
function actionFollower(event) {
	event.preventDefault();
	event.stopPropagation();
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFollower);
	// add spins
	var value = this.querySelector('.ProfileNav-stat .ProfileNav-value');
	// not on profile page
	if (!value) {
		value = this.querySelector('.ProfileCardStats-stat .ProfileCardStats-statValue');
	}
	var old_val = value.innerHTML;
	var temp = document.createElement('img');
	temp.className += 'spin';
	temp.src = chrome.extension.getURL("icons/icon16.png");
	value.innerHTML = `<span>${old_val} <span id='loading1'></span></span>`;
	$(value.querySelector('#loading1')).append(temp);
	// make api call
	follow(checkProfile(), 'Followers');
}

// Clicked highlighted following
function actionFollowing(event) {
	event.preventDefault();
	event.stopPropagation();
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFollowing);
	// add spins
	var value = this.querySelector('.ProfileNav-stat .ProfileNav-value');
	if (!value) {
		value = this.querySelector('.ProfileCardStats-stat .ProfileCardStats-statValue');
	}
	var old_val = value.innerHTML;
	var temp = document.createElement('img');
	temp.className += 'spin';
	temp.src = chrome.extension.getURL("icons/icon16.png");
	value.innerHTML = `<span>${old_val} <span id='loading2'></span></span>`;
	$(value.querySelector('#loading2')).append(temp);
	// make api call
	follow(checkProfile(), 'Following');
}

// Clicked highlighted retweet
function actionRetweet(event) {
	event.stopPropagation();
	var raw = $(this).attr('aria-describedby')
	if (raw == null) {
		raw = $(this).prev().attr('aria-describedby')
	}
	var split = raw.split("aria-");
	var id = split[1];
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	console.log(this);
	this.removeEventListener("click", actionRetweet);
	// add spins
	var value = this.querySelector('.ProfileTweet-actionCount .ProfileTweet-actionCountForPresentation');
	var old_val = value.innerHTML;
	var temp = document.createElement('img');
	temp.className += 'spin';
	temp.src = chrome.extension.getURL("icons/icon16.png");
	value.innerHTML = `<span>${old_val} <span id='loading3'></span></span>`;
	$(value.querySelector('#loading3')).append(temp);
	// make api call
	tweet(id, 'Retweets');
}

// Clicked highlighted like
function actionFavorite(event) {
	event.stopPropagation();
	var raw = $(this).attr('aria-describedby')
	if (raw == null) {
		raw = $(this).prev().attr('aria-describedby')
	}
	var split = raw.split("aria-");
	var id = split[1];
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFavorite);
	// add spins
	var value = this.querySelector('.ProfileTweet-actionCount .ProfileTweet-actionCountForPresentation');
	var old_val = value.innerHTML;
	var temp = document.createElement('img');
	temp.className += 'spin';
	temp.src = chrome.extension.getURL("icons/icon16.png");
	value.innerHTML = `<span>${old_val} <span id='loading4'></span></span>`;
	$(value.querySelector('#loading4')).append(temp);
	// make api call
	tweet(id, 'Likes');
}

// add highlight mask over runnable elements
function highlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
	'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite',
	'button.ProfileTweet-actionButtonUndo.js-actionButton.js-actionRetweet',
	'button.ProfileTweet-actionButtonUndo.ProfileTweet-action--unfavorite.u-linkClean.js-actionButton.js-actionFavorite'];

	// Handle tweet highlights
	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			if (element.style.outline == '') {
				// Retweets
				if (((element.getAttribute('class') == 'ProfileTweet-actionButton  js-actionButton js-actionRetweet') ||
				(element.getAttribute('class') == 'ProfileTweet-actionButtonUndo js-actionButton js-actionRetweet')) && ($(element).css('display') == 'inline-block')) {
					element.style.outline = '2.5px solid blue';
					element.style.backgroundColor = 'lightBlue';
					element.addEventListener("mouseover", mouseOver);
					element.addEventListener("mouseout", mouseOut);
					element.addEventListener("click", actionRetweet);
				}
				// Favorites
				else if (((element.getAttribute('class') == 'ProfileTweet-actionButton js-actionButton js-actionFavorite') ||
				(element.getAttribute('class') == 'ProfileTweet-actionButtonUndo ProfileTweet-action--unfavorite u-linkClean js-actionButton js-actionFavorite')) &&
				($(element).css('display') == 'inline-block') && !element.hasAttribute('checked')) {
					element.style.outline = '2.5px solid blue';
					element.style.backgroundColor = 'lightBlue';
					element.addEventListener("mouseover", mouseOver);
					element.addEventListener("mouseout", mouseOut);
					element.addEventListener("click", actionFavorite);
				}
			}
		}
	}

	// Followers and Following from newsfeed page
	var lis = document.getElementsByClassName("ProfileCardStats-statList Arrange Arrange--bottom Arrange--equal")[0];
	if (lis != null)
	{
		lis = lis.getElementsByTagName("li");
		for (var j = 0; j < lis.length; j++) {
			if (lis[j].style.outline == '')
			{
				var chi = lis[j].children[0].getAttribute('href');
				// Following tab
				if (chi != null && chi.includes('following'))
				{
					lis[j].style.outline = '1.5px solid blue';
					lis[j].style.backgroundColor = 'lightBlue';
					lis[j].addEventListener("mouseover", mouseOver);
					lis[j].addEventListener("mouseout", mouseOut);
					lis[j].addEventListener("click", actionFollowing);
				}
				// Followers tab
				else if (chi != null && chi.includes('followers'))
				{
					lis[j].style.outline = '1.5px solid blue';
					lis[j].style.backgroundColor = 'lightBlue';
					lis[j].addEventListener("mouseover", mouseOver);
					lis[j].addEventListener("mouseout", mouseOut);
					lis[j].addEventListener("click", actionFollower);
				}
			}
		}
	}
	// Followers and Following from profile page
	var lis2 = document.getElementsByClassName("ProfileNav-list")[0];
	if (lis2 != null)
	{
		lis2 = lis2.getElementsByTagName("li");
		for (var k = 0; k < lis2.length; k++)
		{
			if (((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers') ||
			(lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers is-active') ||
			(lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following is-active')) && (lis2[k].style.outline == ''))
			{
				lis2[k].style.outline = '1.5px solid blue';
				lis2[k].style.backgroundColor = 'lightBlue';
				lis2[k].addEventListener("mouseover", mouseOver);
				lis2[k].addEventListener("mouseout", mouseOut);
				if ((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following is-active'))
				{
					lis2[k].addEventListener("click", actionFollowing);
				}
				if ((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers is-active'))
				{
					lis2[k].addEventListener("click", actionFollower);
				}
			}
		}
	}
}

// Highlight the given page
highlight();
// Starts the mutation observer
initiateObserver();
// Starts check for unhighlight
var observerInterval = setInterval(checkObserverStatus, 5000);

// Checks if highlight is still active, if it isn't removes mutation observer and stops checking
function checkObserverStatus()
{
	chrome.runtime.sendMessage({observerRequest: "GetObserver"},
	function (response) {
		//console.log("This is check");
		//console.log(response.observerStatus);
		var connected = response.observerStatus;
		if (!connected)
		{
			if (observer != null)
			{
				clearInterval(observerInterval);
				observer.disconnect();
				observer = null;
			}
		}
	});
}

// Starts the mutation observer that will check for new tweets that enter the timeline
function initiateObserver()
{
	chrome.runtime.sendMessage({observerRequest: "SetObserver"},
	function (response) {
	});
	// Find the Tweet stream of the Timeline
	var target = document.querySelector('ol#stream-items-id.stream-items.js-navigable-stream');
	if (target !== null) {
		// Create an observer to listen for mutations in the Timeline
		observer = new MutationObserver(highlight);
		// Specify configuration options of the observer
		var config = { attributes: true, childList: true, characterData: true };
		// Pass in the target node and the observer options
		observer.observe(target, config);
	}
}
//~~~~~~~~~~~~~~~HIGHLIGHT ELEMENTS END~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
