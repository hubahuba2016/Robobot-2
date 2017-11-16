function unhighlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
				 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite'];

    // Handle tweet unhighlights
	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			element.style = 'none';
		    element.removeEventListener("mouseover", mouseOver);
			element.removeEventListener("mouseout", mouseOut);
			if (i == 0)
			{
			    element.removeEventListener("click", actionRetweet);
			}
			if (i == 1)
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
		for (var j = 1; j < lis.length; j++) {
			lis[j].style = 'none';
		    lis[j].removeEventListener("mouseover", mouseOver);
			lis[j].removeEventListener("mouseout", mouseOut);
			if (j == 1)
			{
				lis[j].removeEventListener("click", actionFollowing);
			}
			if (j == 2)
			{
				lis[j].removeEventListener("click", actionFollower);
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
			lis2[k].style = 'none';
		    lis2[k].removeEventListener("mouseover", mouseOver);
			lis2[k].removeEventListener("mouseout", mouseOut);
			if (k == 1)
			{
				lis2[k].removeEventListener("click", actionFollowing);
			}
			if (k == 2)
			{
				lis2[k].removeEventListener("click", actionFollower);
			}
		}
	}

}

unhighlight();