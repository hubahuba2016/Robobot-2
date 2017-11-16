var configure = require("../content/content.js");

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
   	configure.profile(checkProfile(), 'Followers');
	event.preventDefault();
	event.stopPropagation();
}

function actionFollowing(event) {
   	//alert('1');
   	configure.profile(checkProfile(), 'Following')
	event.preventDefault();
	event.stopPropagation();
}

function actionRetweet(event) {
   	var raw = $(this).attr('aria-describedby')
   	var split = raw.split("aria-");
   	var id = split[1];
   	//alert(id);
   	configure.tweet(id, 'Retweets');
	event.stopPropagation();
}

function actionFavorite(event) {
    var raw = $(this).attr('aria-describedby')
   	var split = raw.split("aria-");
   	var id = split[1];
   	//alert(id);
   	configure.tweet(id, 'Likes');
	event.stopPropagation();
}

function highlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
					 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite'];



    // Handle tweet highlights
	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			//console.log(element.style.zIndex);
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

    // Followers and Following from newsfeed page
	var lis = document.getElementsByClassName("ProfileCardStats-statList Arrange Arrange--bottom Arrange--equal")[0];  
	if (lis != null)
	{
		lis = lis.getElementsByTagName("li");
		for (var j = 1; j < lis.length; j++) {
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
	// Followers and Following from profile page
    var lis2 = document.getElementsByClassName("ProfileNav-list")[0];
    if (lis2 != null)
	{
		lis2 = lis2.getElementsByTagName("li");
	    for (var k = 1; k < 3; k++)
		{
			lis2[k].style.outline = '1.5px solid blue';
			lis2[k].style.backgroundColor = 'lightBlue';
		    lis2[k].addEventListener("mouseover", mouseOver);
			lis2[k].addEventListener("mouseout", mouseOut);
			if (k == 1)
			{
				lis2[k].addEventListener("click", actionFollowing);
			}
			if (k == 2)
			{
				lis2[k].addEventListener("click", actionFollower);
			}
		}
	}
}

highlight();