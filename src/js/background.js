import { hostScriptMappings } from './sources/host_script_mappings.js';

const conditions = Object.keys(hostScriptMappings).map(x => new chrome.declarativeContent.PageStateMatcher({
    pageUrl: { hostEquals: x }
}));

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: conditions,
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.contentScriptType == 'queryCors') {
            var url = request.url;

            const headers = {
                'Content-Type': 'text/plain; charset=utf-8',
            };

            fetch(url, { headers })
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch(error => alert('chrome.runtime.onMessage CORS error'));

            return true;
        }
    }
)