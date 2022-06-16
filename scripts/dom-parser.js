// Examine the current page is Twine or not
function isTwinePage(){
    let storyData = document.querySelector("tw-storydata");
    if(storyData){
        storyFormat = storyData.getAttribute("format");
        if( storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
        }
        if( storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage")    
        }
        currentContent = storyContent;
        if(currentContent)
        {
            return true;
        }  
    }
    return false;
}

/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ------------------------   Read out Story Content   ------------------------ */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

// Read out the content
function readContent(DOMelement,enqueueBool){
    var textToRead = DOMToText(DOMelement);
    //console.log(textToRead)
    chrome.runtime.sendMessage({textToRead: textToRead,enqueueBool: enqueueBool});
}

// Get read out content
function getContent(DOMelement){
    var textToRead = DOMToText(DOMelement);
    return textToRead;
}

// Recursively extract DOM into text - SugarCube
function DOMToText(DOMelement){
    var textToRead = [];

    // When reach to the end node that don't have child nodes
    // for example: <img/>, text
    if(!DOMelement.hasChildNodes()){

        // Node type 1: Tag properties + nodevalue
        if(DOMelement.nodeType == 1 && nodeToText.hasOwnProperty(DOMelement.nodeName)
        && isVisible(DOMelement))
        {
            if(nodeToText[DOMelement.nodeName]!=''){
                textToRead.push('A');
                textToRead.push(nodeToText[DOMelement.nodeName]);
            }
            if(additionalInfo(DOMelement)!=''){
                textToRead.push('A');
                textToRead.push(additionalInfo(DOMelement));
            }
            // Add node values like text
            if(DOMelement.nodeValue)
            {
                textToRead.push('B');
                textToRead.push(DOMelement.nodeValue);
            }
        }

        // Node type 3: nodeValue
        if(DOMelement.nodeType == 3 && DOMelement.nodeValue){
            textToRead.push('B');
            textToRead.push(DOMelement.nodeValue);
        }

        return textToRead;
    }

    // Recursion when having child nodes
    if(nodeToText.hasOwnProperty(DOMelement.nodeName) && isVisible(DOMelement)){

        if(nodeToText[DOMelement.nodeName]!=''){
            textToRead.push('A');
            textToRead.push(nodeToText[DOMelement.nodeName]);
        }
        if(additionalInfo(DOMelement)!=''){
            textToRead.push('A');
            textToRead.push(additionalInfo(DOMelement));
        }

        for(let i=0;i<DOMelement.childNodes.length;i++){
            textToRead=textToRead.concat(DOMToText(DOMelement.childNodes[i]))
        }
    }

    return textToRead;
}

// Additional info for nodes other than tag names
function additionalInfo(DOMelement){
    // add image title if it has one
    if(DOMelement.nodeName=="IMG")
    {
        return DOMelement.getAttribute("title")?DOMelement.getAttribute("title"):'';
    }
    if(DOMelement.nodeName=="INPUT")
    {
        if(DOMelement.getAttribute("type")=="radio"){
            return "radio button"
        }
        return DOMelement.getAttribute("type")?DOMelement.getAttribute("type"):'';
    }
    if(DOMelement.nodeName=="TW-INCLUDE")
    {
        if(DOMelement.getAttribute("type")=="header"){
            return "header"
        }
        if(DOMelement.getAttribute("type")=="footer"){
            return "footer"
        }
        if(DOMelement.getAttribute("type")=="startup"){
            return "startup"
        }
    }
    if(DOMelement.nodeName=="TW-ICON")
    {
        if(DOMelement.getAttribute("title")=="Undo"){
            return "undo"
        }
        if(DOMelement.getAttribute("title")=="Redo"){
            return "redo"
        }
    }
    
    return '';
}

// Check whether the node is visible or not
function isVisible(DOMelement){
    if(window.getComputedStyle(DOMelement).display == "none" 
    || window.getComputedStyle(DOMelement).visibility == "hidden"){
        return false;
    }
    else{
        return true;
    }
}