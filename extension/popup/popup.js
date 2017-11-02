document.addEventListener('DOMContentLoaded', function () {
	function inject() {
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
	        //and inject the script in it
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/inject.js'});
	    });
	}

	document.getElementById('clickme').addEventListener('click', inject);
});
