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
