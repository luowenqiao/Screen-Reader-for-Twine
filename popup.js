

// popup.js
// Run everytime the user clicks the extension icon

var infoP = document.getElementById("info");
String.prototype.splice = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};

var notificationAudio = new Audio("notification.wav");

// Read the initial information
// chrome.tts.speak("Thank you for using Chrome screen reader extension for Twine. \
// Please leave the extension panel open and use keyboard to control the page. \
// To move through the content, use arrow up and arrow down. \
// To move inside the selected tags, use arrow right. \
// To move outside the parent selected tags, use arrow left. \
// To click the link, use shift. \
// To read the selected content, use space. \
// To stop reading, use S. \
// When some page content changes, there will be a notification sound played as a hint. \
// Following are the Twine content: ")

// Add a mask image onto the current image
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
//     chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id},
//         function: addMaskImage
//     });
// });
// function addMaskImage(){
//     const maskImg = document.createElement('img');
//     maskImg.src = "chrome-extension://ijimfckofldclldflofhgfpppmklfgif/mask_image.jpeg";
//     maskImg.style.width=window.innerWidth;
//     maskImg.style.height=window.innerHeight;
//     maskImg.style.position="absolute"
//     document.body.append(maskImg);
// }

// Run on the current tab DOM
// Check if it's an online itch file or local/normal file
// Bool CurrentItch stored in background console
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
    chrome.storage.sync.get("currentItch", ({ currentItch }) => {
        // Regular file: SugarCube/Harlowe
        if(currentItch == false){
            // Examine story format
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id},
                function: getStoryFormatandContent
            },
            (results)=>{
                // results[0].result is the format and content
                displayUI(results[0].result.format);
                // Extract the html and speak
                if(results[0].result.format == "SugarCube"){
                    var domBody = document.createElement('div')
                    domBody.innerHTML = results[0].result.dom;
                    domBody=domBody.childNodes[0];
                    var finalTextToRead = DOMToTextSugarCube(domBody);
                    pageContent = results[0].result.dom;
                    currentContent= results[0].result.dom;
                    //console.log(finalTextToRead)
                    chrome.tts.speak(finalTextToRead,{'enqueue':true});
                }
                if(results[0].result.format == "Harlowe"){
                    var domBody = document.createElement('div')
                    domBody.innerHTML = results[0].result.dom;
                    var finalTextToRead = DOMToTextHarlowe(domBody);
                    pageContent = results[0].result.dom;
                    currentContent= results[0].result.dom;
                    console.log(finalTextToRead)
                    chrome.tts.speak(finalTextToRead,{'enqueue':true});
                }
            });
        }
        // Itch.io page
        else{
            
        }
    });
});

// Get story format and dom innerHTML
function getStoryFormatandContent(){
    let storyData = document.querySelector("tw-storydata");
    let storyContent;
    let storyFormat = "None";

    // When the page is Twine, it will have tw-storydata tag
    if(storyData){

        // SugarCube format, return the sugarcube content
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }

        // This part is for checking page updates
        // chrome.runtime.sendMessage({
        //     content:storyContent.innerText
        // });


        // document.body.onclick=()=>{
        //     chrome.runtime.sendMessage({
        //         content:storyContent.innerText
        //     });
        // }

        // Return the document content for extraction
        return {
            format:storyFormat,
            dom:storyContent.innerHTML
        }
    }
    return {
        format:"None",
        dom:"None"
    }
}

// Recursively extract DOM into text - SugarCube
function DOMToTextSugarCube(DOMelement){
    var textToRead = '';
    for(let i=0;i<DOMelement.childNodes.length;i++)
    {
        if(DOMelement.childNodes[i].nodeType == 3) // 3 is pure text
        {
            textToRead+=DOMelement.childNodes[i].nodeValue;
        }
        else{
            if(DOMelement.childNodes[i].nodeType == 1) // 1 is DOM nodes
            {
                // Convert tag names
                if(nodeToText.hasOwnProperty(DOMelement.childNodes[i].nodeName))
                {
                    textToRead+=nodeToText[DOMelement.childNodes[i].nodeName];
                    textToRead+=additionalInfo(DOMelement.childNodes[i]);
                }
                // Recursively extract DOM children
                if(DOMelement.childNodes[i].childNodes.length>0){
                    textToRead += DOMToTextSugarCube(DOMelement.childNodes[i]);
                }
            }
        }
    }
    return textToRead;
}

// Recursively extract DOM into text - Harlowe
function DOMToTextHarlowe(DOMelement){
    var textToRead = '';
    for(let i=0;i<DOMelement.childNodes.length;i++)
    {
        if(DOMelement.childNodes[i].nodeType == 3) // 3 is pure text
        {
            textToRead+=DOMelement.childNodes[i].nodeValue;
        }
        else{
            if(DOMelement.childNodes[i].nodeType == 1 && DOMelement.childNodes[i].nodeName != "TW-SIDEBAR") // 1 is DOM nodes
            {
                if(nodeToText.hasOwnProperty(DOMelement.childNodes[i].nodeName))
                {
                    textToRead+=nodeToText[DOMelement.childNodes[i].nodeName];
                    //textToRead+=additionalInfo(DOMelement.childNodes[i]);
                }
                if(DOMelement.childNodes[i].childNodes.length>0){
                    textToRead += DOMToTextHarlowe(DOMelement.childNodes[i]);
                }
                
            }
        }
    }
    return textToRead;
}

// Display the current extraction status
function displayUI(message){
    if(message == "SugarCube" || message == "Harlowe")
    {
        infoP.innerHTML = message + " file detected.";
    }
    else{
        infoP.innerHTML = "This page is not SugarCube/Harlowe Twine format.";
    }
}

// Additional info for nodes other than tag names
function additionalInfo(DOMelement){
    // add image title if it has one
    if(DOMelement.nodeName=="IMG")
    {
        return DOMelement.getAttribute("title")?","+DOMelement.getAttribute("title")+". ":'';
    }
    if(DOMelement.nodeName=="INPUT")
    {+". "
        if(DOMelement.getAttribute("type")=="radio"){
            return ", radio button. "
        }
        return DOMelement.getAttribute("type")?","+DOMelement.getAttribute("type")+". ":'';
    }
    return '';
}

