document.addEventListener('DOMContentLoaded', function () {
   getButtonStatus();
   function inject() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
			//and inject the script in it
			changeButtonStatus();
			//chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
            chrome.tabs.executeScript(tabs[0].id, {file: 'popup/inject.js'});
        });
  }

   function undoHighlight() {
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
	        //and inject the script in it
	        changeButtonStatus();
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
	        setObserver()
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
	document.getElementById('clickme').addEventListener('click', inject);
	document.getElementById('unclickme').addEventListener('click', undoHighlight);
});

// Simple returns the button status
function getButtonStatus() {
	    chrome.runtime.sendMessage({buttonRequest: "GetButton"},
	        function (response) {
	        	document.getElementById('clickme').disabled = response.buttonStatus;
	    });
}

// Changes the button status
function changeButtonStatus() {
    chrome.runtime.sendMessage({buttonRequest: "ChangeButton"},
        function (response) {
        	document.getElementById('clickme').disabled = response.buttonStatus;
    });
}

// Change the observer state for our timeline checker
function setObserver() {
	chrome.runtime.sendMessage({observerRequest: "SetObserver"},
	        function (response) {
	        	//console.log("This is undo");
	});
}

// Listener for page change to update popup elements
chrome.runtime.onMessage.addListener( function(message,sender,callback)
{
    if(message.pageChange === true)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        	document.getElementById('clickme').disabled = false;
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
	    });
    }
});
