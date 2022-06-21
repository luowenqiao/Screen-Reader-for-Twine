/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------   Keyboard Control   --------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

// Keyboard Controls
// Settings in settings.js
function keyboardControl(){

    document.addEventListener("keydown",function(event){

        let systemKey;
        if(systemName.indexOf("Mac")!=-1){
            systemKey = event.metaKey;
        }else{
            systemKey = event.ctrlKey;
        }

        // 1. up (outside)
        if( systemKey && event.shiftKey && event.key == "ArrowUp" && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                moveOutside();
            }
            if(currentStage == 1){ // settings
                settingUp();
            }
            // if(currentStage == 2){ // tutorial
            //     //
            // }
        }

        // 2. down (inside)
        if(systemKey && event.shiftKey && event.key == "ArrowDown" && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                moveInside();
            }
            if(currentStage == 1){ // settings
                settingDown();
            }
            // if(currentStage == 2){ // tutorial
            //     null;
            // }
        }

        // 3. left (choose)
        if(systemKey && event.shiftKey && event.key == "ArrowLeft" && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                moveUp();
            }
            if(currentStage == 1){ // settings
                settingLeft();
            }
            // if(currentStage == 2){ // tutorial
            //     null;
            // }
        }

        // 4. right (choose)
        if(systemKey && event.shiftKey && event.key == "ArrowRight" && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                moveDown();
            }
            if(currentStage == 1){ // settings
                settingRight();
            }
            // if(currentStage == 2){ // tutorial
            //     null;
            // }
        }

        // 5. space (read)
        if(systemKey && event.shiftKey && event.key == " " && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                startOrStop();
            }
            if(currentStage == 1){ // settings
                null;
            }
            // if(currentStage == 2){ // tutorial seq 0
            //     changeTutorial(0);
            // }
        }

        // 6. interact (click)
        if(systemKey && event.shiftKey && event.key == "Enter" && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                clickAction();
            }
            if(currentStage == 1){ // settings
                null;
            }
            // if(currentStage == 2){ // tutorial
            //     null;
            // }
        }

        // 7. settings (s)
        if(systemKey && event.shiftKey && event.key == "s")
        {   
            settingsControl();
        }

        // 8. tutorial
        if(systemKey && event.shiftKey && event.key == "1")
        {
            if(window.location.href == tutorialUrl){
                closeTutorial();
            }
            else{  
                openTutorial();
            }
        }

        // 9. move through all the links
        if(systemKey && event.shiftKey && event.altKey && useKeyboard)
        {
            if(currentStage == 0 || currentStage == 2){ // screen reader
                moveInteractable();
            }
            if(currentStage == 1){ // settings
                null;
            }
            
        }

        // 9. display for tutorial
        // if(currentStage == 2){
        //     if(event.metaKey){
        //         displayMeta();
        //     }
        //     if(event.shiftKey){
        //         displayShift();
        //     }
        //     //displayKey(event.key)
        // }
        
        if(event.location == 0 && !(event.metaKey || event.altKey || event.shiftKey || event.ctrlKey))
        {
            speakKeyboard(event.key)
        }
    })

    // document.addEventListener("keyup",function(event){
    //     if(currentStage == 2){
    //         if(event.key == "Meta"){
    //             cancelMeta();
    //         }
    //         if(event.key == "Shift"){
    //             cancelShift();
    //         }
    //         //cancelKey(event.key)
    //     }
    // })
}

function getInteractableNodes(){
    let interactableNodes = Array.from(storyContent.querySelectorAll("a, form, input, textarea, button, select, optgroup, option, tw-link, tw-enchantment, tw-icon"));
    for(let i =0;i<interactableNodes.length;i++){
        if(!isVisible(interactableNodes[i])){
            interactableNodes.splice(i,i+1)
        }
    }
    return interactableNodes;
}

function moveInteractable(){

    // move through links
    if(interactableNodes.indexOf(currentContent) != -1){
        // is selecting nodes, move to the next
        if(currentInteract<interactableNodes.length-1){
            currentInteract = interactableNodes.indexOf(currentContent)+1;
        }
        else{
            currentInteract = 0;
        } 
    }else{
        // not selecting nodes, select from the start
        currentInteract = 0;
   }

   currentContent = interactableNodes[currentInteract];
   readContent(currentContent,false);
   changeDisplay();
}

function openTutorial(){
    chrome.runtime.sendMessage({openTutorial:true});
}
function closeTutorial(){
    chrome.runtime.sendMessage({closeTutorial:true});
}

function speakKeyboard(keyName){
    chrome.runtime.sendMessage({textToRead: ["\\&",keyName],enqueueBool: false});
}

function moveUp(){

    directionSound.play();

    let tempContent = currentContent;

    // When move from the root story node's first child child Node (first story node),
    // move upside to the parent node
    if((currentContent.parentNode.parentNode == storyContent && storyFormat == "SugarCube")
    || (currentContent.parentNode == storyContent && storyFormat == "Harlowe"))
    {
        let previousNode = findPreviousNode(currentContent);
        if(previousNode == null){
            currentContent = storyContent;
        }
        else{
            currentContent = previousNode;
        }
        
        if(tempContent == currentContent){
            chrome.runtime.sendMessage({hint:1,txt:getContent(currentContent)})
        }else{
            changeDisplay();
            readContent(currentContent,false);
        }
        return;
    }

    // Otherwise, move up in the same node layer
    // If it's not moved to the first node of the layer, then the node is changed
    // Otherwise, stay at the first node
    let previousNode = findPreviousNode(currentContent);
    if(previousNode!=null){
        currentContent = previousNode;
    }

    if(tempContent == currentContent){
        chrome.runtime.sendMessage({hint:1,txt:getContent(currentContent)})
    }else{
        changeDisplay();
        readContent(currentContent,false)
    }
    
}
function findPreviousNode(element){
    if(element.previousSibling){
        var tempContent = element.previousSibling;
        if(tempContent.nodeType == 3 
            || (tempContent.nodeType == 1 
                && nodeToText.hasOwnProperty(tempContent.tagName)
                && isVisible(tempContent)
            )
        ){
            return tempContent;
        }
        else{
            return findPreviousNode(tempContent)
        }
           
    }
    return null;
}

function moveDown(){

    directionSound.play();

    let tempContent = currentContent; // a temp content to check if the selection changed or not

    // When move from the root story node, move inside to the first node
    if(currentContent == storyContent)
    {    
        if(storyFormat == "SugarCube"){
            currentContent = currentContent.firstChild.firstChild;
        }
        if(storyFormat == "Harlowe"){
            currentContent = currentContent.firstChild;
        }

        // if the current content is not visible and has next sibling
        if(!(currentContent.nodeType == 3 
            || (currentContent.nodeType == 1 
                && nodeToText.hasOwnProperty(currentContent.tagName)
                && isVisible(currentContent)
            )
        )){
           let nextNode = findNextNode(currentContent)
           if(nextNode!=null){
            currentContent = nextNode;
            }
        }
        
        if(currentContent == tempContent){
            chrome.runtime.sendMessage({hint:2,txt:getContent(currentContent)})
        }else{
            changeDisplay();
            readContent(currentContent,false);    
        }
       
        return;
    }

    // Otherwise, move to the next node in the same layer
    // Find if there is an available next node (nodetype = 3 or hasproperty & visible)
    // Otherwise, stay
    let nextNode = findNextNode(currentContent);
    if(nextNode!=null){
        currentContent = nextNode;
    }
    
    if(currentContent == tempContent){// have reached the end of the content
        chrome.runtime.sendMessage({hint:2,txt:getContent(currentContent)})
    }
    else{
        changeDisplay();
        readContent(currentContent,false)
    }
}

function findNextNode(element){
    if(element.nextSibling){
        var tempContent = element.nextSibling;
        if(tempContent.nodeType == 3 
            || (tempContent.nodeType == 1 
                && nodeToText.hasOwnProperty(tempContent.tagName)
                && isVisible(tempContent)
            )
        ){
            return tempContent;
        }
        else{
            return findNextNode(tempContent)
        }
           
    }
    return null;
}

function moveInside(){

    directionSound.play();

    let tempContent = currentContent;

    // Move one step further for sugarcube
    if((currentContent == storyContent) && storyFormat == "SugarCube"){
        currentContent = currentContent.firstChild;
    }

    // Move to the first available child node
    if(currentContent.hasChildNodes()){
        if(currentContent.childNodes.length >1)
        {
            let tempChildNode = findChildNode(currentContent.firstChild)
            if(tempChildNode != null){
                currentContent = tempChildNode;
            }
            else{
                if(storyFormat == "SugarCube"){
                    currentContent = storyContent;
                }
            }
        }
        else{
            if(currentContent.childNodes.length == 1 && currentContent.firstChild.nodeType != 3){
                currentContent = currentContent.firstChild;
            }
        }
        
    }

    if(tempContent == currentContent){
        chrome.runtime.sendMessage({hint:2,txt:getContent(currentContent)})
    }else{
        changeDisplay(currentContent);
        readContent(currentContent,false)
    }
}

function findChildNode(element){
    if(element.nodeType == 3 
        || (element.nodeType == 1 
            && nodeToText.hasOwnProperty(element.tagName)
            && isVisible(element)
        )
    ){
       return element;
    }
    else{
        if(element.nextElementSibling){
            return findChildNode(element.nextElementSibling)
        }
        else{
            return null;
        }
    }
}

function moveOutside(){

    directionSound.play();

    let tempContent = currentContent;

    // Move index to the parent node
    if(currentContent != storyContent){
        if((currentContent.parentNode.parentNode == storyContent && storyFormat == "SugarCube")
        || (currentContent.parentNode == storyContent && storyFormat == "Harlowe")
        ){
            //move to the root node
            currentContent = storyContent;
        }
        else{
            currentContent = currentContent.parentNode;
        }
    }

    if(tempContent == currentContent){
        chrome.runtime.sendMessage({hint:1,txt:getContent(currentContent)})
    }else{
        changeDisplay();
        readContent(currentContent,false)
    }
}


function clickAction(){

    // Check if it is interactable or not and only for single deep nodes
    var interactable = false;
    var tempContent = currentContent;

    // The node itself
    if(isInteractable(currentContent)){
        interactable = true;
    }

    // Recursive upwards
    if(!interactable){
        while(tempContent != storyContent){
            if((!tempContent.nextSibling) && (!tempContent.previousSibling))
            {
                tempContent = tempContent.parentNode;
                if(isInteractable(tempContent)){
                    interactable = true;
                    break;
                }
            }
            else break;
        }
    }
    
    // Recursive downwards
    // Get first interactable child if possible
    if(!interactable){
        tempContent = currentContent;
        while(tempContent.nodeType != 3 && tempContent.hasChildNodes && tempContent.childNodes.length == 1){
            tempContent = tempContent.firstChild;
            if(isInteractable(tempContent)){
                interactable = true;
                break;
            }
        }
    }

    // the interaction will execute if the node is interactable
    if(interactable){
        switch(tempContent.tagName){
            case "A":
                tempContent.click();break; // need to relocate
            case "BUTTON":
                tempContent.click();break; // need to relocate
            case "TEXTAREA":
                tempContent.focus();break;
            case "SELECT":
                tempContent.click();break;
            case "TW-ICON":
                tempContent.click();break;
            case "INPUT":
                switch(tempContent.type){
                    case "checkbox":   
                    case "radio":
                    case "submit":
                    case "reset":
                    case "button":
                        tempContent.click();break;

                    case "number":
                    case "text":
                    case "password":
                    case "date":
                    case "email":
                        tempContent.focus();break;
                    
                    default:
                        break;

                }
                break;
            case "TW-LINK":
            case "TW-ENCHANTMENT":
                tempContent.click();break
            default:
                break;
        }
    }

    // Get storyContent again

    // console.log(document.activeElement)
}

function isInteractable(element){
    if(element.tagName == "A" || element.tagName == "BUTTON" 
    || element.tagName == "INPUT" || element.tagName == "SELECT"
    || element.tagName == "TEXTAREA"
    || element.tagName == "TW-LINK" 
    || element.tagName == "TW-ENCHANTMENT"
    || element.tagName == "TW-ICON"){
        return true
    }
    else return false;
}

function startOrStop(){
    var currentRead = getContent(currentContent);
    chrome.runtime.sendMessage({stop:true, currentRead:currentRead});
}

/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ------------------------------   Voice Control   --------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
function voiceControl(){
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    const command = ["up","down","outside","inside","click","read","stop","settings"];
    const grammar = '#JSGF V1.0; grammar commands; public <command> = ' + command.join(' | ') + ' ;'

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.addEventListener("keydown",function(event){

        let systemKey;
        if(systemName.indexOf("Mac")!=-1){
            systemKey = event.metaKey;
        }else{
            systemKey = event.ctrlKey;
        }

        // voice control
        if(systemKey && event.shiftKey && event.key == "2" && useVoice)
        {
            recognition.start();
        }
    });

    recognition.onresult = function(event) {
        let commandResult = event.results[event.results.length-1][0].transcript;
        commandResult = commandResult.trim();
        if(command.includes(commandResult)){
            switch(commandResult){
                case "up": 
                    isSetting?settingUp():moveUp();break;
                case "down": 
                    isSetting?settingDown():moveDown();break;
                case "outside":
                    isSetting?settingLeft():moveOutside();break;
                case "inside": 
                    isSetting?settingRight():moveInside();break;
                case "click":
                    isSetting?null:clickAction();break;
                case "read":
                case "stop":
                    isSetting?null:startOrStop();break;
                case "settings":
                    settingsControl();break;
                case "tutorial":
                    openTutorial();break;
                default:break;
            }
        }
    }

    // recognition.onspeechend = function() {
    //     recognition.stop();
    // }
}