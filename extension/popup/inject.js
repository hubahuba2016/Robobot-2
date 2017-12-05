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

var p = document.createElement('h1');
var b = document.createElement('br');
var textnode = document.createTextNode('Bot Detection Results');
p.appendChild(textnode);
con.appendChild(p);
con.appendChild(b);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementById("clo");

btn.onclick = function(event) {
    event.stopPropagation();
    if (event.target.id = 'myBtn') {
      modal.style.display = "block";
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

//~~~~~~~~~~~~~~~HIGHLIGHT ELEMENTS START~~~~~~~~~~~~~~~~~~~~~~~~~~~
var observer = null;

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

// var ele = document.querySelector('.ProfileNav .ProfileNav-list .ProfileNav-item--followers .ProfileNav-stat');
// var old_val = ele.querySelector('.ProfileNav-value').innerHTML;
// var bots = ele.innerHTML = `<span class="ProfileNav-label" aria-hidden="true">Followers</span> <span class="ProfileNav-value" data-is-compact="false">${old_val} <p class='js-tooltip' data-original-title="bot count" style='display:inline'>(${val})</p></span>`;

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function actionFollower(event) {
  //alert('1');
  event.preventDefault();
	event.stopPropagation();
	this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFollower);
  // add spins
  var value = this.querySelector('.ProfileNav-stat .ProfileNav-value');
  if (!value) {
    value = this.querySelector('.ProfileCardStats-stat .ProfileCardStats-statValue');
  }
  var old_val = value.innerHTML;
  var temp = document.createElement('img');
  temp.className += 'spin';
  temp.src = chrome.extension.getURL("icons/icon16.png");
  value.innerHTML = `<span>${old_val} <span id='loading1'></span></span>`;
  $(value.querySelector('#loading1')).append(temp);
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
  follow(checkProfile(), 'Following');
}

function actionRetweet(event) {
    event.stopPropagation();
   	var raw = $(this).attr('aria-describedby')
   	if (raw == null)
    {
        raw = $(this).prev().attr('aria-describedby')
    }
   	var split = raw.split("aria-");
   	var id = split[1];
   	// ADD SPINNING BUTTON ICON
    var icon = this.querySelector(".IconContainer");
    icon.className += " spin";
    this.style = 'none';
	  this.removeEventListener("mouseover", mouseOver);
	  this.removeEventListener("mouseout", mouseOut);
    this.removeEventListener("click", actionRetweet);
   	tweet(id, 'Retweets');
}

function actionFavorite(event) {
	event.stopPropagation();
    var raw = $(this).attr('aria-describedby')
    if (raw == null)
    {
        raw = $(this).prev().attr('aria-describedby')
    }
   	var split = raw.split("aria-");
   	var id = split[1];
   	// ADD SPINNING BUTTON ICON
    var icon = this.querySelector(".IconContainer");
    icon.className += " spin";
   this.style = 'none';
	this.removeEventListener("mouseover", mouseOver);
	this.removeEventListener("mouseout", mouseOut);
	this.removeEventListener("click", actionFavorite);
   	tweet(id, 'Likes');
}
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
			if (element.style.outline == '')
			{
				// Retweets
				if (((element.getAttribute('class') == 'ProfileTweet-actionButton  js-actionButton js-actionRetweet') || 
				    (element.getAttribute('class') == 'ProfileTweet-actionButtonUndo js-actionButton js-actionRetweet')) && ($(element).css('display') == 'inline-block'))
				{
					element.style.outline = '2.5px solid blue';
					element.style.backgroundColor = 'lightBlue';
				    element.addEventListener("mouseover", mouseOver);
					element.addEventListener("mouseout", mouseOut);
				    element.addEventListener("click", actionRetweet);
				}
				// Favorites
				else if (((element.getAttribute('class') == 'ProfileTweet-actionButton js-actionButton js-actionFavorite') || 
				    (element.getAttribute('class') == 'ProfileTweet-actionButtonUndo ProfileTweet-action--unfavorite u-linkClean js-actionButton js-actionFavorite')) &&
				    ($(element).css('display') == 'inline-block') && !element.hasAttribute('checked'))
				{
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

function modalContent(results, bot_score) {
  var lines = results.split('|');
  // bot user : score
  var count = 0;
  for (var index = 0; index < lines.length; index++) {
    var line = lines[index].split(':');
    var user = line[0];
    var score = line[1];
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
      con.appendChild(p);
      con.appendChild(s);
      con.appendChild(b);
    }
  }
}

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
      var arr = responseText.split('|');
      // tweet heading
      var h = document.createElement('h3');
      var b = document.createElement('br');
      var textnode = document.createTextNode('(' + redir + ') ' + name);
      h.appendChild(textnode);
      con.appendChild(b);
      con.appendChild(h);
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
        con.appendChild(p);
        con.appendChild(b);
      }
			console.log(`TWEET result: ${result}`);
			if (result !== undefined) inject(result, name, redir);
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
      var arr = responseText.split('|');
      // tweet heading
      var h = document.createElement('h3');
      var b = document.createElement('br');
      var textnode = document.createTextNode('(' + redir + ') ' + name);
      h.appendChild(textnode);
      con.appendChild(b);
      con.appendChild(h);
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
        con.appendChild(p);
        con.appendChild(b);
      }
			console.log(`FOLLOW result: ${result}`);
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
		// var ele = tw.querySelector('.content .stream-item-footer .ProfileTweet-actionList .ProfileTweet-action--favorite .ProfileTweet-actionButton .ProfileTweet-actionCount');
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
