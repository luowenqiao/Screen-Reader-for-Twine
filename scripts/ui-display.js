/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* -------------------------------   UI Frame   ------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function frameDisplay(){

    var rect = currentContent.getBoundingClientRect()

    var frameDiv = document.createElement("div")
    frameDiv.id = "twine-selection-frame-display"
    frameDiv.style.position = "absolute";
    frameDiv.style.zIndex = "2147483647";
    frameDiv.style.border = "gold 2px solid";
    frameDiv.style.borderRadius = "4px";
    frameDiv.style.boxShadow = "0px 0px 8px gold"
    frameDiv.style.left = (rect.left-5) +"px";
    frameDiv.style.top = (rect.top-5+window.scrollY) +"px";
    frameDiv.style.width = (rect.width+8) +"px";
    frameDiv.style.height = (rect.height+8) +"px";
    frameDiv.style.pointerEvents = "none";

    document.body.insertBefore(frameDiv, document.body.firstChild);
}

function changeDisplay(){

    var frameDiv = document.getElementById("twine-selection-frame-display")
    
    if(currentContent.nodeType == 3){
        var range = document.createRange();
        range.selectNodeContents(currentContent);
        if (range.getBoundingClientRect) {
            var rect = range.getBoundingClientRect();
            frameDiv.style.left = (rect.left-5) +"px";
            frameDiv.style.top = (rect.top-5+window.scrollY) +"px";
            frameDiv.style.width = (rect.width+8) +"px";
            frameDiv.style.height = (rect.height+8) +"px";
        }
        
    }
    else{
        if(currentContent.nodeType == 1){
            var rect = currentContent.getBoundingClientRect()
            frameDiv.style.left = (rect.left-5) +"px";
            frameDiv.style.top = (rect.top-5+window.scrollY) +"px";
            frameDiv.style.width = (rect.width+8) +"px";
            frameDiv.style.height = (rect.height+8) +"px";
        }
    }
}