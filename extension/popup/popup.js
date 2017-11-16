document.addEventListener('DOMContentLoaded', function () {
	function inject() {
		//document.getElementById('clickme').disabled = true;
		//document.getElementById('unclickme').disabled = false;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
			//and inject the script in it
            chrome.tabs.executeScript(tabs[0].id, {file: 'popup/inject.js'});
        });
	}

    function undoHighlight() {
        //document.getElementById('clickme').disabled = false;
		//document.getElementById('unclickme').disabled = true;
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
	        //and inject the script in it
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
	    });
	}

	document.getElementById('clickme').addEventListener('click', inject);
	document.getElementById('unclickme').addEventListener('click', undoHighlight);
});