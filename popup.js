// Initialize the start button 
let changeColor = document.getElementById("startReader");

// When the button is clicked, inject startScreenReader into current page
// TODO: 1. Execute automatically(or by control) instead of clicking a button 
// TODO: 2. Send messages or check whether the extraction is done correctly
changeColor.addEventListener("click", async () => {

  // Here the document refers to popup.html, this log is in background
  console.log(document);

  //Inject and execute the script on the current page
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startScreenReader,
  });
  
});

// This function will be executed as a content script inside the current page
function startScreenReader() {

  // Here the document refers to the current page, this log is in current page
  console.log("current page ",document);

}
