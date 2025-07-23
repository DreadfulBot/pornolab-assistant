// Removed chrome.declarativeContent usage for Manifest v3 compatibility
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptType == 'queryCors') {
            var url = request.url
            const headers = {
                'Content-Type': 'text/plain charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }

            fetch(url, { headers })
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch(error => console.log('Pornolab chrome plugin: chrome.runtime.onMessage CORS error', error))

            return true;
        }
    }
)