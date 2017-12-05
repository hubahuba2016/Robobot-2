var buttonActive = false; // For popup button
var reloadConnected = false; // For timeline reload

chrome.runtime.onMessage.addListener(function(message, sender, callback){
    if(message.type === 'showPageAction'){
        chrome.pageAction.show(sender.tab.id);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {

    $.ajax({
        type: request.method,
        url: request.url,
        data: request.data,
        contentType : 'application/json;charset=UTF-8',
        crossDomain: true,
        success: function(responseText) {
            callback(responseText);
        },
        error: function(xhr, status, error) {
            callback();
        }
    });

    return true; // prevents the callback from being called too early on return
  }
});

// Listener for button changes and page change requests
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    // Return button status
    if( request.buttonRequest === "GetButton" )
    {
        //console.log("GetButton");
        chrome.tabs.query({active:true},function(tabs){
            sendResponse( {buttonStatus: buttonActive} );
        });  
        return true;      
    }
    // Change button status
    else if (request.buttonRequest == "ChangeButton")
    {
        //console.log("ChangeButton");
        chrome.tabs.query({active:true},function(tabs){
            sendResponse( {buttonStatus: buttonActive} );
        });  
        buttonActive = !buttonActive;
        return true;    

    }
    // Get timeline change observer
    else if (request.observerRequest == "GetObserver")
    {
        chrome.tabs.query({active:true},function(tabs){
            sendResponse( {observerStatus: reloadConnected} );
        }); 
        return true;
    }
    // Change timeline change observer
    else if (request.observerRequest == "SetObserver")
    {
        var temp = reloadConnected;
        chrome.tabs.query({active:true},function(tabs){
            sendResponse( {observerStatus: temp} );
        }); 
        reloadConnected = !reloadConnected;
        return true;
    }
});

// Gets called multiple times per request, we only want url change
// Updates for page change
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.url != undefined)
        {
            console.log(changeInfo.url)
            // TURN OFF HIGHLIGHTING FOR THAT PAGE
            chrome.runtime.sendMessage({pageChange:true}); // This is when user still has popup open
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id, {file: 'popup/undoHighlight.js'});
            });
            // MAKE SURE BUTTON IS IN START STATE
            buttonActive = false;
            // MAKE SURE CHECK FOR TWEETS IS OFF
            reloadConnected = false;
        }
    }
);
