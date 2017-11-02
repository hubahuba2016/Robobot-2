function highlight() {
	var tweets = document.querySelectorAll('div.tweet');
	var highlight = ['span.username.u-dir', 
					 'button.ProfileTweet-actionButton.js-actionButton.js-actionRetweet',
					 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite',
					 'a[data-nav="followers"]'];
					 //'a.ProfileNav-stat.ProfileNav-stat--link.u-borderUserColor.u-textCenter.js-tooltip.js-openSignupDialog.js-nonNavigable.u-textUserColor.in'];


	// Idea: Use querySelectorAll instead and iterate through that and add a class

	for (var i = 0; i < highlight.length; i++) {
		var selected = document.querySelectorAll(highlight[i]);

		for (var element of selected) {
			// element.classList.add('highlighted');
			element.style.outline = '2.5px solid blue';
			element.style.backgroundColor = 'lightBlue';
		}
	}

	// for (var i = 0; i < highlight.length; i++) {
	// 	for (var j = 0; j < tweets.length; j++) {
	// 		var element = tweets[j].querySelector(highlight[i]);
	// 		element.style.outline = '2.5px solid blue';
	// 		element.style.backgroundColor = 'lightBlue';
	// 		console.log(element);
	// 	}
	// }

	// var element = document.querySelector('a.ProfileNav-stat.ProfileNav-stat--link.u-borderUserColor.u-textCenter.js-tooltip.js-openSignupDialog.js-nonNavigable.u-textUserColor');
	// 			element.style.outline = '2.5px solid blue';
	// 		element.style.backgroundColor = 'lightBlue';
}

highlight();