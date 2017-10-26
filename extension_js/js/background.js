chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {

    $.ajax({
        type: request.method,
        url: request.url,
        data: request.data,
        contentType : 'application/json;charset=UTF-8',
        crossDomain: true,
        success: function(responseText){
            callback(responseText);
        },
        error: function(xhr, status, error) {
            var acc = []
            $.each(xhr, function(index, value) {
                acc.push(index + ': ' + value);
            });
            alert(JSON.stringify(acc));
        }
    });

    return true; // prevents the callback from being called too early on return
  }
});