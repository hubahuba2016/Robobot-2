document.addEventListener('DOMContentLoaded', function () {
	getButtonStatus();
	openTab(event, 'Main');

	/*Injects the javascript for highlighting elements*/
	function inject() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
			//and inject the script in it
			changeButtonStatus();
            chrome.tabs.executeScript(tabs[0].id, {file: 'popup/inject.js'});
        });
	}

	/*Undos the javascript for the highlighting elements*/
    function undoHighlight() {
	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        // query the active tab, which will be only one tab
	        //and inject the script in it
	        changeButtonStatus();
	        chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
	        setObserver()
	    });
	}

	/*Turns highlighting function on and off*/
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


	/*Score changer*/
	function range() {
		var slider = document.getElementById("slideBar");
		var output = document.getElementById("score");
		output.innerHTML = slider.value + '%';
		
		//Gets the score from previous session
		chrome.storage.local.get('score', function(items){
			if(items.score) {
				output.innerHTML = items.score + '%';
				slider.value = items.score;
			}

			else {
				output.innerHTML = slider.value + '%';
			}
		});

		//Changes the slider value shown as slider moves
		slider.oninput = function() {
	 	 	 output.innerHTML = slider.value + '%';
		 }

		//Sends updated score to server and to content.js
		slider.onchange = function() {
			chrome.storage.local.set({'score': slider.value}, function(){});

		 	chrome.runtime.sendMessage({
			method: 'POST',
			action: 'xhttp',
			url: 'http://localhost:5000/set_score',
			data: JSON.stringify(slider.value)
			}, function(responseText) {
			});

		 	var threshold = {'value': (slider.value / 100)};
		 	chrome.tabs.query({}, tabs => {
		 		tabs.forEach(tab => {
		 			chrome.tabs.sendMessage(tab.id, threshold);
		 		});
		 	});
		 };
	}

	/*Modifies the whitelist*/
	function wlist() {
		var wlist = document.getElementById('Whitelist');
		
		chrome.storage.local.get({white: []}, function(items){
			if (items.white) {
				var w = items.white;
				blist.innerHTML = w.join(', ');
			}
		});
	}
	
	/*Modifies the blacklist*/
	function blist() {
		var	blist = document.getElementById('Blacklist');

		chrome.storage.local.get({black: []}, function(items){
			if (items.black) {
				var b = items.black;
				blist.innerHTML = b.join(', ');
			}
		});
	}	

	/*Switches tab*/
	function openTab(evt, tabName) {
    	var i;
    	var tabcontent = document.getElementsByClassName('tabcontent');

    	//Get all elements with class tabcontent and hide them
	   	for (i = 0; i < tabcontent.length; i++) {
        	tabcontent[i].style.display = "none";
    	}

    	//Get all elements with class tablinks and remove class active
    	var tablinks = document.getElementsByClassName("tablinks");
    	for (i = 0; i < tablinks.length; i++) {
        	tablinks[i].className = tablinks[i].className.replace(" active", "");
    	}

    	//Show current tab and add active class to button that opened the tab
    	document.getElementById(tabName).style.display = "block";
    	evt.currentTarget.className += " active";
	}

	
	range();
	wlist();
	blist();
	
	document.getElementById('main').addEventListener('click', function() {openTab(event, 'Main')});
	document.getElementById('wl').addEventListener('click', function() {openTab(event, 'Whitelist')});
	document.getElementById('bl').addEventListener('click', function() {openTab(event, 'Blacklist')});
	
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
