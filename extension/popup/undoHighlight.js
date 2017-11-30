function unhighlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
					 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite',
					 'button.ProfileTweet-actionButtonUndo.js-actionButton.js-actionRetweet',
					 'button.ProfileTweet-actionButtonUndo.ProfileTweet-action--unfavorite.u-linkClean.js-actionButton.js-actionFavorite'];

    // Handle tweet unhighlights
	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			element.style = 'none';
		    element.removeEventListener("mouseover", mouseOver);
			element.removeEventListener("mouseout", mouseOut);
			if ((element.getAttribute('class') == 'ProfileTweet-actionButton  js-actionButton js-actionRetweet') || 
				(element.getAttribute('class') == 'ProfileTweet-actionButtonUndo js-actionButton js-actionRetweet'))
			{
			    element.removeEventListener("click", actionRetweet);
			}
			if ((element.getAttribute('class') == 'ProfileTweet-actionButton js-actionButton js-actionFavorite') || 
		        (element.getAttribute('class') == 'ProfileTweet-actionButtonUndo ProfileTweet-action--unfavorite u-linkClean js-actionButton js-actionFavorite'))
			{
				element.removeEventListener("click", actionFavorite);
			}
		}
	}

    // Followers and Following from newsfeed page
	var lis = document.getElementsByClassName("ProfileCardStats-statList Arrange Arrange--bottom Arrange--equal")[0];  
	if (lis != null)
	{
		lis = lis.getElementsByTagName("li");
		for (var j = 0; j < lis.length; j++) {
			var chi = lis[j].children[0].getAttribute('href');
			// Following tab
			if (chi != null && chi.includes('following'))
			{
				lis[j].style = 'none';
		    	lis[j].removeEventListener("mouseover", mouseOver);
				lis[j].removeEventListener("mouseout", mouseOut);
				lis[j].removeEventListener("click", actionFollowing);
			}
			// Followers tab
			else if (chi != null && chi.includes('followers'))
			{
				lis[j].style = 'none';
		   	 	lis[j].removeEventListener("mouseover", mouseOver);
				lis[j].removeEventListener("mouseout", mouseOut);
				lis[j].removeEventListener("click", actionFollower);
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
			if ((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers') ||
				(lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers is-active') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following is-active'))
			{
				lis2[k].style = 'none';
		   	 	lis2[k].removeEventListener("mouseover", mouseOver);
				lis2[k].removeEventListener("mouseout", mouseOut);
				if ((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--following is-active'))
				{
					lis2[k].removeEventListener("click", actionFollowing);
				}
				if ((lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers') || (lis2[k].getAttribute('class') == 'ProfileNav-item ProfileNav-item--followers is-active'))
				{
					lis2[k].removeEventListener("click", actionFollower);
				}
		    }
		}
	}

}

unhighlight();
