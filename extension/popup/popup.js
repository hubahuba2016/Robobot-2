document.addEventListener('DOMContentLoaded', function () {
	getButtonStatus();
	function inject() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
			//and inject the script in it
			changeButtonStatus();
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

	function toggled()
	{
		if(document.getElementById('highlightToggle').checked)
		{
			inject();
		}
		else
		{
			undoHighlight();
		}
	}


	//for the slider
	function range() {
		var slider = document.getElementById("slideBar");
		var output = document.getElementById("score");
		output.innerHTML = slider.value + '%';
		
		//document.getElementById('output').innerHTML = "hello?";
		
		chrome.storage.local.get('score', function(items){
			if(items.score) {
				output.innerHTML = items.score + '%';
				slider.value = items.score;
			}

			else {
				output.innerHTML = slider.value + '%';
			}
		});

		slider.oninput = function() {
	 	 	 output.innerHTML = slider.value + '%';
		 }

		slider.onchange = function() {
			chrome.storage.local.set({'score': slider.value}, function(){});

		 	/*chrome.runtime.sendMessage({
			method: 'POST',
			action: 'xhttp',
			url: 'http://localhost:5000/set_score',
			data: JSON.stringify(slider.value)
			}, function(responseText) {
			});*/

		 	var threshold = {'value': slider.value};
		 	chrome.tabs.query({}, tabs => {
		 		tabs.forEach(tab => {
		 			chrome.tabs.sendMessage(tab.id, threshold);
		 		});
		 	});

			/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        	chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
	    	});*/
		 };
	}

	function wlist() {
		var wlist = document.getElementById('whitelist');
		
		chrome.storage.local.get('white', function(items){
			if (items.white) {
				wlist.innerHTML = items.white;
			}
		});
	}
	
	function blist() {
		var	blist = document.getElementById('blacklist');

		chrome.storage.local.get('black', function(items){
			if (items.black) {
				blist.innerHTML = items.black;
			}
		});
	}	

	function testTest() {
		chrome.storage.local.clear(function(){});
	}

	range();
	wlist();
	blist();
	document.getElementById('please').addEventListener('click', testTest);
	document.getElementById('highlightToggle').addEventListener('click', toggled);
});

// Simple returns the button status
function getButtonStatus() {
	    chrome.runtime.sendMessage({buttonRequest: "GetButton"},
	        function (response) {
	        	document.getElementById('highlightToggle').checked = response.buttonStatus;
	    });
}

// Changes the button status
function changeButtonStatus() {
    chrome.runtime.sendMessage({buttonRequest: "ChangeButton"},
        function (response) {
        	document.getElementById('highlightToggle').checked = response.buttonStatus;
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
        	document.getElementById('highlightToggle').checked = false;
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
	    });
    }
});
