console.log("background script loaded.");

// Listen for received message from content script and set to background scope globally
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendRequest(tab.id, { method: "getSelection" }, function (response) {
        sendServiceRequest(response.data);
    });
});