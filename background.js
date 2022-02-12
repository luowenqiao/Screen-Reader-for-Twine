// background.js
// Run as console
var currentItch = false;
var itchRegex = RegExp(/^(http:\/\/|https:\/\/)?[A-Za-z0-9\-]+([\.]{1}itch\.io)(\/[A-Za-z0-9\-]+)+$/gm);
var storedHTML = '';

// Run when chrome installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('background.js and document are loaded');
});

// Everytime switched tabs
chrome.tabs.onActivated.addListener( function(activeInfo){
  storedHTML = '';
  chrome.tabs.get(activeInfo.tabId, function(tab){
      if(tab.url.match(itchRegex))
      {
        chrome.storage.sync.set({ currentItch:true });
      }
      else{
        chrome.storage.sync.set({ currentItch:false });
      }
  });
});

// Everytime there's update in one tab
chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  if (tab.active && change.url) {
    if(change.url.match(itchRegex))
    {
      chrome.storage.sync.set({ currentItch:true });
    }
    else{
      chrome.storage.sync.set({ currentItch:false });
    }       
  }
});

// Run when content-script sends message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //request.content is the innterHTML, for checking updates
    // when clicked/opened the extension
    if(storedHTML != request.content){
      if(storedHTML != ""){
        // The page content has changed. Notify the user.
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {notification:true});
        });
      }
      storedHTML = request.content;
    }
  }
);