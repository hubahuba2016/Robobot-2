var bot_score;

document.addEventListener('DOMContentLoaded', function () {
	function inject() {
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
	        //and inject the script in it
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/inject.js'});
	    });
	}

	function range() {
		var slider = document.getElementById("slideBar");
		var output = document.getElementById("score");
		bot_score = slider.value;
		output.innerHTML = slider.value + '%';

		slider.oninput = function() {
	 	 	 output.innerHTML = this.value + '%';
		 }

		slider.onchange = function() {
		 	chrome.runtime.sendMessage({
			method: 'POST',
			action: 'xhttp',
			url: 'http://localhost:5000/set_score',
			data: JSON.stringify(slider.value)
			}, function(responseText) {
			});

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        	chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
	    	});
		 };
	}

	range();
	document.getElementById("clickme").addEventListener("click", inject);
});
