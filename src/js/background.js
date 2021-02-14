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