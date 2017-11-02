var tweets = document.querySelectorAll('div.tweet');
var users = {};
var tweetsy = {};

for (var i = 0; i < tweets.length; i++) {
	var user_id = tweets[i].getAttribute('data-user-id');
	var screen_name = tweets[i].getAttribute('data-screen-name');
	var tweetsy_id = tweets[i].getAttribute('data-tweet-id');
	tweetsy[i] = tweetsy_id;
	users[user_id] = screen_name;
}

for (key in users) {
	if (users[key] != null) {
		console.log(users[key]);
		poster(users[key]);
	}
}

// for (key in tweetsy) {
// 	if (tweetsy[key] != null) {
// 		console.log(tweetsy[key]);
// 		retweeter(tweetsy[key]);
// 	}
// }

// $(tweets[0]).append('<button id="myBtn">Open Modal</button>');


// $('body').append('<div id="myModal" class="mod"> <div class="mod-content"> <span class="close">&times;</span> <p>Some text in the Modal..</p> </div> </div>');

// // Get the modal
// var modal = document.getElementById('myModal');
// console.log(modal);

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");
// console.log(btn);

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on the button, open the modal 
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

function poster(name) {
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/is_user_bot',
        data: JSON.stringify(name)
    }, function(responseText) {
    		var tweets = document.querySelectorAll('div.tweet');

			for (var i = 0; i < tweets.length; i++) {
				var screen_name = tweets[i].getAttribute('data-screen-name');

				if (screen_name === name) {
					var node = document.createElement('small');
					var textnode = document.createTextNode(responseText);
					node.appendChild(textnode);
					node.style.display = 'inline';
					tweets[i].querySelector('.stream-item-header').appendChild(node);


					if (responseText === 'bot') {
						var group = tweets[i].querySelector('.account-group.js-account-group.js-action-profile.js-user-profile-link.js-nav');

						var avatar = tweets[i].querySelector('.avatar.js-action-profile-avatar');

						var badge = document.createElement('img');
						badge.src = chrome.extension.getURL("icons/badge.png");
						badge.classList.add('avatar');
						badge.classList.add('badge');

						var wrapper = document.createElement('div');
						group.insertBefore(wrapper, group.firstChild);
						wrapper.appendChild(avatar);
						wrapper.appendChild(badge);

						// var div = document.createElement('div');
						// // var textnode = document.createTextNode('bot');
						// // div.appendChild(textnode);
						// div.classList.add('bot');
						// tweets[i].appendChild(div);
						// var img = document.createElement('img');
						// img.src = chrome.extension.getURL("icons/icon.png");
						// img.classList.add('center');
						// img.classList.add('spin');
						// div.appendChild(img);
					}
				}
			}
    });
}

function retweeter(name) {
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/check_post',
        data: JSON.stringify(name)
    }, function(responseText) {
    		var tweets = document.querySelectorAll('div.tweet');

			for (var i = 0; i < tweets.length; i++) {
				var post_id = tweets[i].getAttribute('data-tweet-id');
				if (post_id === name) {
					var node = document.createElement("P");
					var textnode = document.createTextNode(responseText);
					node.appendChild(textnode);
					node.style.display = 'inline';
					tweets[i].querySelector('.stream-item-footer').appendChild(node);
				}
			}
    });
}
