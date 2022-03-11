var posPointer = [0];
var currentContent = "";
var pageContent = '';

// Detecting commands of keyboard
document.addEventListener('keydown', function(event) {
    switch(event.key){
        // move up
        case "ArrowUp":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: moveUp,
                    args:[posPointer,currentContent]
                },
                (results)=>{
                    posPointer=results[0].result.posPointer
                    currentContent=results[0].result.currentContent
                    if(results[0].result.format == "SugarCube"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextSugarCube(domBody);
                        //console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    if(results[0].result.format == "Harlowe"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextHarlowe(domBody);
                        console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    //formerStyle=results[0].result.formerStyle
                });
            });
            break;
        // move down
        case "ArrowDown":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: moveDown,
                    args:[posPointer,currentContent]
                },
                (results)=>{
                    posPointer=results[0].result.posPointer
                    currentContent=results[0].result.currentContent
                    if(results[0].result.format == "SugarCube"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextSugarCube(domBody);
                        //console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    if(results[0].result.format == "Harlowe"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextHarlowe(domBody);
                        console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                });
            });
            break;
        // move inside
        case "ArrowRight":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: moveInside,
                    args:[posPointer,currentContent]
                },
                (results)=>{
                    posPointer=results[0].result.posPointer
                    currentContent=results[0].result.currentContent
                    if(results[0].result.format == "SugarCube"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextSugarCube(domBody);
                        //console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    if(results[0].result.format == "Harlowe"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextHarlowe(domBody);
                        console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                });
            });
            break;
        // move outside
        case "ArrowLeft":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: moveOutside,
                    args:[posPointer,currentContent]
                },
                (results)=>{
                    posPointer=results[0].result.posPointer
                    currentContent=results[0].result.currentContent
                    if(results[0].result.format == "SugarCube"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextSugarCube(domBody);
                        //console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    if(results[0].result.format == "Harlowe"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextHarlowe(domBody);
                        console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                });
            });
            break;
        // click the link
        case "Shift":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: clickLink,
                    args:[posPointer,pageContent]
                },
                (results)=>{
                    //Compare if this is in-page or out-page
                    pageContent=results[0].result.pageContent
                    posPointer=[0]
                    currentContent=pageContent
                    // if come to a new page, notify new page, and de-select

                    // if in-page update, notify in-page updates

                });
            });
            break;
        // de-select to all content

        // read the current selection
        case " ":
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id},
                    function: getStoryFormatandContent
                },
                (results)=>{

                    if(results[0].result.format == "SugarCube"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent;
                        var finalTextToRead = DOMToTextSugarCube(domBody);
                        //console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                    if(results[0].result.format == "Harlowe"){
                        var domBody = document.createElement('div')
                        domBody.innerHTML = currentContent
                        var finalTextToRead = DOMToTextHarlowe(domBody);
                        console.log(finalTextToRead)
                        chrome.tts.speak(finalTextToRead);
                    }
                });
            });
            break;
        // stop reading
        case "s":
            chrome.tts.stop();
            break;
        // TODO read out the updates

        default:break;
    }

    //console.log(posPointer)
    
});

function moveUp(posPointer,currentContent){
    // When the index of the current tree layer is not 0, index--

    // get the root content
    let storyData = document.querySelector("tw-storydata");

    if(storyData){

        // Get tree data
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }
        
        // If it's the start root node's first child node, move down to the parent root node
        if(posPointer.length == 2 & posPointer[0] == 0 && posPointer[1] == 0){
            posPointer.pop();
            currentContent = storyContent.innerHTML;
        }

        // Has to change the index or not
        if(posPointer[posPointer.length-1]>0){

            // Route to the current node's parent
            for(let i=0;i<posPointer.length-1;i++){
                storyContent = storyContent.childNodes[posPointer[i]]
            }

            // Restore the former selected border style
            //storyContent.childNodes[posPointer[posPointer.length-1]].style.border=formerStyle;

            // Move index to upper one
            posPointer[posPointer.length-1]--;

            //Skip the newline tags
            while(storyContent.childNodes[posPointer[posPointer.length-1]].tagName == 'BR' && posPointer[posPointer.length-1]>0){
                posPointer[posPointer.length-1]--;
            }

            // Read the current node
            if(storyContent.childNodes[posPointer[posPointer.length-1]].nodeType==3){
                currentContent = storyContent.childNodes[posPointer[posPointer.length-1]].nodeValue
            }
            else{
                
                currentContent = storyContent.childNodes[posPointer[posPointer.length-1]].outerHTML
                // var rect = storyContent.childNodes[posPointer[posPointer.length-1]].getBoundingClientRect()
                // console.log(rect.top,rect.left)
            }
        

            // Store and change the current selected node
            // if(storyContent.childNodes[posPointer[posPointer.length-1]].style.border=="")
            // {
            //     formerStyle = "none"
            // }
            // else{
            //     formerStyle=storyContent.childNodes[posPointer[posPointer.length-1]].style.border
            // }
            
            // storyContent.childNodes[posPointer[posPointer.length-1]].style.border="yellow solid 2px"
        }
    }
    
    return {posPointer:posPointer,currentContent:currentContent,format:storyFormat}
}

function moveDown(posPointer,currentContent){
    // get the root content
    let storyData = document.querySelector("tw-storydata");
    if(storyData){

        // Get tree data
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }

        // If it's the start root node, move down to the first child node
        if(posPointer.length == 1 && posPointer[0]==0){
            posPointer.push(0)

            if(storyContent.childNodes[0].childNodes[0].nodeType==3){
                currentContent = storyContent.childNodes[0].childNodes[0].nodeValue
            }
            else{
                currentContent = storyContent.childNodes[0].childNodes[0].outerHTML
            }

            return {posPointer:posPointer,currentContent:currentContent,format:storyFormat}
        }
        
        // Route to the current node's parent node
        for(let i=0;i<posPointer.length-1;i++){
            storyContent = storyContent.childNodes[posPointer[i]]
        }

        // The node is changed or not
        if(posPointer[posPointer.length-1]<storyContent.childNodes.length-1){
            // Restore the former selected border style
            //storyContent.childNodes[posPointer[posPointer.length-1]].style.border=formerStyle;

            //Move index to up
            posPointer[posPointer.length-1]++;

            // Skip the newline tags
            while(storyContent.childNodes[posPointer[posPointer.length-1]].tagName == 'BR' && posPointer[posPointer.length-1]<storyContent.childNodes.length-1){
                posPointer[posPointer.length-1]++;
            }

            if(storyContent.childNodes[posPointer[posPointer.length-1]].nodeType==3){
                currentContent = storyContent.childNodes[posPointer[posPointer.length-1]].nodeValue
            }
            else{
                currentContent = storyContent.childNodes[posPointer[posPointer.length-1]].outerHTML
            }
            
            // Store and change the current selected node
            // if(storyContent.childNodes[posPointer[posPointer.length-1]].style.border=="")
            // {
            //     formerStyle = "none"
            // }
            // else{
            //     formerStyle=storyContent.childNodes[posPointer[posPointer.length-1]].style.border
            // }
            // storyContent.childNodes[posPointer[posPointer.length-1]].style.border="yellow solid 2px"
        }
    }

    return {posPointer:posPointer,currentContent:currentContent,format:storyFormat}
}

function moveInside(posPointer,currentContent){
    // get the root content
    let storyData = document.querySelector("tw-storydata");

    if(storyData){

        // Get tree data
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }
        //console.log(storyContent.firstChild.children)
        // Route to the current node's parent node
        for(let i=0;i<posPointer.length;i++){
            storyContent = storyContent.childNodes[posPointer[i]]
        }

        // Move index to the child node
        if(storyContent.childNodes.length>1){
            // Restore the former selected border style
            // if(formerStyle != "new"){
            //     storyContent.style.color=formerStyle;
            // }
            
            // Move index
            posPointer.push(0)

            if(storyContent.childNodes[0].nodeType==3){
                currentContent = storyContent.childNodes[0].nodeValue
            }
            else{
                currentContent = storyContent.childNodes[0].outerHTML
            }
            
            
            // Store and change the current selected node
            // formerStyle=storyContent.childNodes[posPointer[posPointer.length-1]].style.color
            // storyContent.childNodes[posPointer[posPointer.length-1]].style.color="red"
        }

       
    }
    
    return {posPointer:posPointer,currentContent:currentContent,format:storyFormat}
}

function moveOutside(posPointer,currentContent){
    // get the root content
    let storyData = document.querySelector("tw-storydata");
    if(storyData){

        // Get tree data
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }

        
        // Move index to the parent node
        if(posPointer.length>1){

            // Route to the current node's parent node
            for(let i=0;i<posPointer.length-1;i++){
                storyContent = storyContent.childNodes[posPointer[i]]
            }

            // Restore the former selected border style
            //storyContent.childNodes[posPointer[posPointer.length-1]].style.border=formerStyle;

            posPointer.pop();

            if(storyContent.nodeType==3){
                currentContent = storyContent.nodeValue
            }
            else{
                currentContent = storyContent.outerHTML
            }

            //console.log(currentContent)
            // Store and change the current selected node
            // if(storyContent.style.border=="")
            // {
            //     formerStyle = "none"
            // }
            // else{
            //     formerStyle=storyContent.style.border
            // }
            // storyContent.style.border="yellow solid 2px"
        }
    }
    
    return {posPointer:posPointer,currentContent:currentContent,format:storyFormat}
}

function clickLink(posPointer,pageContent){
    
    let storyData = document.querySelector("tw-storydata");
    if(storyData){

        // Get tree data
        storyFormat = storyData.getAttribute("format")
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")
        }

        for(let i=0;i<posPointer.length;i++){
            storyContent = storyContent.childNodes[posPointer[i]]
        }

        if(storyContent.nodeType != 3){
            let firstLink = storyContent.querySelector("a")
            if(firstLink){

                firstLink.click();

                // notify update & renew current content
                console.log(document.getElementById("passages"))
                chrome.runtime.sendMessage({
                    update:document.getElementById("passages")==pageContent
                });
                pageContent=document.getElementById("passages").innerHTML
                //console.log(document.getElementById("passages") == storyContent)
            }
        }
    }
    
    return {pageContent:pageContent}
}

// Play the notification sound when there's updates
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.notification == true){}
        notificationAudio.play();
    }
);
