/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------   Keyboard Control   --------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

// Keyboard Controls
function keyboardControl(){
    document.addEventListener("keydown",function(event){
        speakKeyboard(event.key);
        switch(event.key){
            case "ArrowUp": 
                isSetting?settingUp():moveUp();break;
            case "ArrowDown": 
                isSetting?settingDown():moveDown();break;
            case "ArrowLeft":
                isSetting?settingLeft():moveOutside();break;
            case "ArrowRight": 
                isSetting?settingRight():moveInside();break;
            case "Shift":
                isSetting?null:clickAction();break;
            case " ":
                isSetting?null:startOrStop();break;
            case "z":
                settings();break;
            case "1":
                openTutorial();break;
            default:break;
        }
    })
}

function openTutorial(){
    chrome.runtime.sendMessage({openTutorial:true});
}

function settings(){
    isSetting = !isSetting;
    if(isSetting){
        chrome.runtime.sendMessage({isSetting:1});
        settingItem = 1;
    }
    else{
        chrome.runtime.sendMessage({isSetting:0});
    }
}

function settingUp(){
    //currently 4 items: rate, volume, keyboard control, voice control
    if(settingItem > 1){
        settingItem -= 1;
    }else{
        settingItem = 4;
    }
    chrome.runtime.sendMessage({
        settingItem:settingItem,
        speechRate:speechRate,
        speechVolume:speechVolume,
        useVoice:useVoice,
        useKeyboard:useKeyboard
    });
}

function settingDown(){
    if(settingItem < 4){
        settingItem+=1;
    }else{
        settingItem = 1;
    }
    chrome.runtime.sendMessage({
        settingItem:settingItem,
        speechRate:speechRate,
        speechVolume:speechVolume,
        useVoice:useVoice,
        useKeyboard:useKeyboard
    });
}

function settingLeft(){//Minus
    let needNotify = false;
    switch(settingItem){
        case 2://rate
            if(speechRate>0.5) speechRate-=0.1;break;
        case 3://volume
            if(speechVolume>0.2) speechVolume-=0.1;break;
        case 4://keyboard control
            if(useVoice == false)
            {
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }
            if(useVoice == true){
                useKeyboard = !useKeyboard;
            }
            break;
        case 1://voice control
            if(useKeyboard == false){
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }   
            if(useKeyboard == true){
                useVoice = !useVoice;
            }
            break;
        default:break;
    }
    if(!needNotify){
        chrome.runtime.sendMessage({
            settingItem:settingItem,
            speechRate:speechRate,
            speechVolume:speechVolume,
            useVoice:useVoice,
            useKeyboard:useKeyboard
        });
    }
}
function settingRight(){//Add
    let needNotify = false;
    switch(settingItem){
        case 2://rate
            if(speechRate<2.0) speechRate+=0.1;break;
        case 3://volume
            if(speechVolume<1.0) speechVolume+=0.1;break;
        case 4://keyboard control
            if(useVoice == false)
            {
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }
            if(useVoice == true){
                useKeyboard = !useKeyboard;
            }
            break;
        case 1://voice control
            if(useKeyboard == false){
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }   
            if(useKeyboard == true){
                useVoice = !useVoice;
            }
            break;
        default:break;
    }
    if(!needNotify){
        chrome.runtime.sendMessage({
            settingItem:settingItem,
            speechRate:speechRate,
            speechVolume:speechVolume,
            useVoice:useVoice,
            useKeyboard:useKeyboard
        });
    }
}

function speakKeyboard(keyName){
    //chrome.runtime.sendMessage({textToRead: keyName,enqueueBool: false});
}
function moveUp(){

    directionSound.play();
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
        
        changeDisplay();
        readContent(currentContent,false);

        return;
    }

    // Otherwise, move up in the same node layer
    // If it's not moved to the first node of the layer, then the node is changed
    // Otherwise, stay at the first node
    let previousNode = findPreviousNode(currentContent);
    if(previousNode!=null){
        currentContent = previousNode;
    }

    changeDisplay();
    readContent(currentContent,false)
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
        
        changeDisplay();
        readContent(currentContent,false);

        return;
    }

    // Otherwise, move to the next node in the same layer
    // Find if there is an available next node (nodetype = 3 or hasproperty & visible)
    // Otherwise, stay
    let nextNode = findNextNode(currentContent);
    if(nextNode!=null){
        currentContent = nextNode;
    }
    
    changeDisplay();
    readContent(currentContent,false)
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

    // Move one step further for sugarcube
    if((currentContent == storyContent) && storyFormat == "SugarCube"){
        currentContent = currentContent.firstChild;
    }

    // Move to the first available child node
    if(currentContent.hasChildNodes()){
        if(currentContent.childNodes.length >1)
        {
            let tempChildNode=findChildNode(currentContent.firstChild)
            if(tempChildNode != null){
                currentContent = tempChildNode;
            }
            else{
                if(storyFormat == "SugarCube"){
                    currentContent = storyContent;
                }
            }
        }
    }

    changeDisplay(currentContent);
    readContent(currentContent,false)
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
        if(element.nextSibling){
            return findChildNode(element.nextSibling)
        }
        else{
            return null;
        }
    }
}

function moveOutside(){

    directionSound.play();

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

    changeDisplay();
    readContent(currentContent,false)
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
    || element.tagName == "TW-ENCHANTMENT"){
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
/* ----------------------------   Update Listener   --------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function updateListener(){
    let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        let oldValue = mutation.oldValue;
        let newValue = mutation.target.textContent;
        if (oldValue !== newValue) {
            // an update occurs
            if( storyFormat == "SugarCube"){
                storyContent = document.getElementById("passages")
            }
            if( storyFormat == "Harlowe"){
                storyContent = document.querySelector("tw-passage")    
            }
            currentContent = storyContent;
            notificationSound.play();
            changeDisplay();
        }
    });
    });

    observer.observe(document.body, {
        characterDataOldValue: true, 
        subtree: true, 
        childList: true, 
        characterData: true
    });
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

    const command = ["up","down","outside","inside","click","read","stop"];
    const grammar = '#JSGF V1.0; grammar commands; public <command> = ' + command.join(' | ') + ' ;'

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    document.body.ondoubleclick = function() {
        recognition.start();
        //console.log('Ready to receive a command.');
    }

    recognition.onresult = function(event) {
        let commandResult = event.results[0][0].transcript;
        if(command.includes(commandResult)){
            switch(commandResult){
                case "up": 
                    moveUp();break;
                case "down": 
                    moveDown();break;
                case "outside":
                    moveOutside();break;
                case "inside": 
                    moveInside();break;
                case "click":
                    clickAction();break;
                case "read":
                case "stop":
                    startOrStop();break;
            }
        }
    }

    recognition.onspeechend = function() {
        recognition.stop();
    }
}