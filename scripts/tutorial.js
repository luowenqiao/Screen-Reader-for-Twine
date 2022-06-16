// Tutorial Item Sequence: 
// 0. space, 
// 1. arrow up & down, 
// 2. arrow right & left, 
// 3. arrow enter
// 4. s - settings
// 5. 2 - voice control
// 6. 1 - open/close tutorial


function initialTutorial(){
    var frameDiv = document.getElementById("twine-selection-frame-display");

    var tutorialDiv = document.createElement("div");
    tutorialDiv.id = "screen-reader-tutorial-display";
    tutorialDiv.style.position = "absolute";
    tutorialDiv.style.zIndex = "2147483646";
    tutorialDiv.style.border = "gold 2px solid";
    tutorialDiv.style.backgroundColor = "white";
    tutorialDiv.style.borderRadius = "10px";
    tutorialDiv.style.boxShadow = "0px 0px 10px gold";
    tutorialDiv.style.left = (window.innerWidth/2 - 300) +"px";
    tutorialDiv.style.top = (window.innerHeight/2 - 200) +"px";
    tutorialDiv.style.width = 600 +"px";
    tutorialDiv.style.height = 400 +"px";
    tutorialDiv.style.display = "none";
    tutorialDiv.style.color = "black";
    tutorialDiv.style.padding = "10px";
    tutorialDiv.style.fontSize = "30px";
    tutorialDiv.style.fontWeight = "bold";

    tutorialDiv.innerHTML = 
    "<h1 align='center'>Tutorial</h1>"
    +"<div style='display:flex;width:100%'>"
        +"<div style='flex:1'>"
            +"<p id='tutorial_cmd' style='border:2px black solid;border-radius:4px;padding:4px'>Command</p>"
            +"<p id='tutorial_sft'style='border:2px black solid;border-radius:4px;padding:4px;'>Shift</p>"
            +"<p id='tutorial_rdm'style='border:2px black solid;border-radius:4px;padding:4px;'>Space</p>"
        +"</div>"
        +"<div style='flex:2;padding-left:20px;'>"
            +"<p id='tutorial_content'>"
                +"This is an example sentence. "
                +"You can press Command, Shift, Arrow Up pr Arrow Down to select the content. "
            +"</p>"
        +"</div>"
    +"</div>";

    document.body.insertBefore(tutorialDiv,frameDiv);
}

function tutorialControl(){
    isTutorial = !isTutorial;
    if(isTutorial){
        // open tutorial
        displayTutorial();
    }
    else{
        // close settings
        closeTutorial();
    }
}

function displayTutorial(){
    let tutorialDiv = document.getElementById("screen-reader-tutorial-display");
    tutorialDiv.style.display = "block";

    currentStage = 2;
    tutorialItem = 0;
    if(isSetting){
        tutorialDiv.style.zIndex = "2147483647";
    }
    else{

        tutorialDiv.style.zIndex = "2147483646";
    }

    chrome.runtime.sendMessage({isTutorial:1});
}

function closeTutorial(){
    if(isSetting){
        currentStage = 1;
        chrome.runtime.sendMessage({isTutorial:3});// to settings
    }
    else{
        currentStage = 0;
        chrome.runtime.sendMessage({isTutorial:2}); // to screen reader
    }

    let tutorialDiv = document.getElementById("screen-reader-tutorial-display");
    tutorialDiv.style.display = "none";
}

function displayMeta(){
    let metaKeyboard = document.getElementById("tutorial_cmd");
    metaKeyboard.style.backgroundColor = "yellow";
}
function cancelMeta(){
    let metaKeyboard = document.getElementById("tutorial_cmd");
    metaKeyboard.style.backgroundColor = "white";
}
function displayShift(){
    let metaKeyboard = document.getElementById("tutorial_sft");
    metaKeyboard.style.backgroundColor = "yellow";
}
function cancelShift(){
    let metaKeyboard = document.getElementById("tutorial_sft");
    metaKeyboard.style.backgroundColor = "white";
}

// function displayKey(keyName){
//     let conditionKeyboard = document.getElementById("tutorial_rdm");
//     switch(tutorialItem){
//         case 0:
//             if(keyName == " "){
//                 conditionKeyboard.innerHTML = "ArrowLeft / ArrowRight";
//                 tutorialItem++;
//             } 
//             break;
//         case 1:
//             if(keyName == "ArrowLeft" || keyName == "ArrowRight"){
//                 tutorialItem++;
//                 conditionKeyboard.innerHTML = "ArrowUp / ArrowDown"
//             }
//             break;
//         case 2:
//             if(keyName == "ArrowUp" || keyName == "ArrowDown")
//                 conditionKeyboard.style.backgroundColor = "yellow";
//             break;
//         case 3:
//             if(keyName == "Enter")
//                 conditionKeyboard.style.backgroundColor = "yellow";
//             break;
//         case 4:
//             if(keyName == "s")
//                 conditionKeyboard.style.backgroundColor = "yellow";
//             break;
//         case 5:
//             if(keyName == "2")
//                 conditionKeyboard.style.backgroundColor = "yellow";
//             break;
//         case 6:
//             if(keyName == "1")
//                 conditionKeyboard.style.backgroundColor = "yellow";
//             break;
//         default:break;
//     }
// }

// function cancelKey(keyName){
//     let conditionKeyboard = document.getElementById("tutorial_rdm");
//     switch(tutorialItem){
//         case 0:
//             if(keyName == " ")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 1:
//             if(keyName == "ArrowLeft" || keyName == "ArrowRight")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 2:
//             if(keyName == "ArrowUp" || keyName == "ArrowDown")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 3:
//             if(keyName == "Enter")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 4:
//             if(keyName == "s")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 5:
//             if(keyName == "2")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         case 6:
//             if(keyName == "1")
//                 conditionKeyboard.style.backgroundColor = "white";
//             break;
//         default:break;
//     }
// }

function changeTutorial(itemIndex){
    chrome.runtime.sendMessage({tutorialItem:itemIndex});
    let tutorialContent = document.getElementById("tutorial_content");
    switch(itemIndex){
        case 0:
            
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
    }
    tutorialItem++;
}

