var applyBtn=document.getElementById("apply");
var cancelBtn = document.getElementById("cancel");

// Add a mask on to the Twine page
applyBtn.addEventListener("click",(e)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id},
            function: addMask
        });
    });
})

// Cancel the mask on the Twine page
cancelBtn.addEventListener("click",(e)=>{
    document.body.style.width="300px";
    document.body.style.height="200px";
})

function addMask(){
    document.body.style.mask="linear-gradient(transparent, transparent)";
    document.body.style.webkitMaskComposite="linear-gradient(transparent), transparent)";
}