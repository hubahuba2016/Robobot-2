var tweets = document.querySelectorAll('div.tweet');
$(tweets[0]).append('<button id="myBtn">Open Modal</button>');

var modal = document.createElement('div');
modal.id = 'myModal';
modal.classList.add('mod');
document.body.appendChild(modal);

var close = document.createElement('div');
close.classList.add('PermalinkProfile-dismiss', 'modal-close-fixed');
modal.appendChild(close);

var closeIcon = document.createElement('span');
closeIcon.id = 'clo';
closeIcon.classList.add('Icon', 'Icon--close');
close.appendChild(closeIcon)

var con = document.createElement('div');
con.classList.add('mod-content');
modal.appendChild(con);

var p = document.createElement('p');
var textnode = document.createTextNode('hiibi');
p.appendChild(textnode);
con.appendChild(p);

p = document.createElement('p');
textnode = document.createTextNode('hiibi');
p.appendChild(textnode);
con.appendChild(p);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get the modal
var modal = document.getElementById('myModal');
console.log(modal);

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
console.log(btn);

// Get the <span> element that closes the modal
var span = document.getElementById("clo");

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
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

function checkProfile() {
	var url = window.location.pathname;
    var profile = url.split("/").slice(-1)[0];
    if (profile === undefined || profile === '') {
	    var ur = document.querySelector('.DashboardProfileCard-content .DashboardProfileCard-userFields .DashboardProfileCard-screenname .DashboardProfileCard-screennameLink .username .u-linkComplex-target').innerHTML;
	    profile = ur;
    }
    return profile;
}

function mouseOver() {
    this.style.setProperty ("background-color", "#ff9933", "important");
}

function mouseOut() {
    this.style.setProperty ("background-color", "lightblue", "important");
}

function actionFollower(event) {
   	//alert('1');
    event.preventDefault();
	event.stopPropagation();
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFollower);
	follow(checkProfile(), 'Followers');
}

function actionFollowing(event) {
   	//alert('1');
   	event.preventDefault();
	event.stopPropagation();
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFollowing);
   	follow(checkProfile(), 'Following');
}

function actionRetweet(event) {
    event.stopPropagation();
   	var raw = $(this).attr('aria-describedby')
   	var split = raw.split("aria-");
   	var id = split[1];
   	//alert(id);
    this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionRetweet);
   	tweet(id, 'Retweets');
}

function actionFavorite(event) {
	event.stopPropagation();
    var raw = $(this).attr('aria-describedby')
   	var split = raw.split("aria-");
   	var id = split[1];
   	//alert(id);
   	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFavorite);
   	tweet(id, 'Likes');
}

function highlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
					 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite'];



    // Handle tweet highlights
	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			if (element.style.outline == '')
			{
				$(element).wrap( "<span></span>" );
				element.style.outline = '2.5px solid blue';
				element.style.backgroundColor = 'lightBlue';
			    element.addEventListener("mouseover", mouseOver);
				element.addEventListener("mouseout", mouseOut);
				if (i == 0)
				{
				    element.addEventListener("click", actionRetweet);
				}
				if (i == 1)
				{
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
		for (var j = 1; j < lis.length; j++) {
			if (lis[j].style.outline == '')
			{
				lis[j].style.outline = '1.5px solid blue';
				lis[j].style.backgroundColor = 'lightBlue';
			    lis[j].addEventListener("mouseover", mouseOver);
				lis[j].addEventListener("mouseout", mouseOut);
				if (j == 1)
				{
					lis[j].addEventListener("click", actionFollowing);
				}
				if (j == 2)
				{
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

highlight();

// Check Retweets or Likes on a tweet
function tweet(name, redir) {
	var result;
	console.log(`running tweet(${name}, ${redir})`);
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/check_post/' + redir,
        data: JSON.stringify(name)
    }, function(responseText) {
			result = responseText;
			console.log(`TWEET result: ${result}`);
			if (result !== undefined) inject(result, '926553250064687109', redir);
    });
}

// Check Followers or Following on a profile page or timeline
function follow(name, redir) {
	var result;
	console.log(`running follow(${name}, ${redir})`);
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/follow/' + redir,
        data: JSON.stringify(name)
    }, function(responseText) {
			result = responseText;
			console.log(`FOLLOW result: ${result}`);
			if (result !== undefined) inject(result, '' ,redir);
    });
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Front-End Inject
function inject(val, tweetID, act) {
	if (act === 'Retweets') {
		var tw = document.querySelector('div.tweet[data-tweet-id="'+tweetID+'"]');
		var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--retweet .ProfileTweet-actionButtonUndo .ProfileTweet-actionCount');
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
