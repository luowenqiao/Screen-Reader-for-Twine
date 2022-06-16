function initialSettings(){
    var frameDiv = document.getElementById("twine-selection-frame-display");

    var settingsDiv = document.createElement("div");
    settingsDiv.id = "screen-reader-settings-display";
    settingsDiv.style.position = "absolute";
    settingsDiv.style.zIndex = "2147483646";
    settingsDiv.style.border = "gold 2px solid";
    settingsDiv.style.backgroundColor = "white";
    settingsDiv.style.borderRadius = "10px";
    settingsDiv.style.boxShadow = "0px 0px 10px gold";
    settingsDiv.style.left = (window.innerWidth/2 - 300) +"px";
    settingsDiv.style.top = (window.innerHeight/2 - 200) +"px";
    settingsDiv.style.width = 600 +"px";
    settingsDiv.style.height = 400 +"px";
    settingsDiv.style.display = "none";
    settingsDiv.style.color = "black";
    settingsDiv.style.padding = "10px";
    settingsDiv.style.fontSize = "30px";
    settingsDiv.style.fontWeight = "bold";

    settingsDiv.innerHTML = 
    "<h1 align='center'>Settings</h1>"
    +"<div style='display:flex;width:100%'>"
        +"<div style='flex:2'>"
            +"<p>Speech Rate (0.5 - 2.0)</p>"
            +"<p>Speech Volume (0.1 - 1.0)</p>"
            +"<p>Keyboard Control</p>"
            +"<p>Voice Control</p>"
        +"</div>"
        +"<div style='flex:1'>"
            +"<p id='sr_settings_para_1'>1.0</p>"
            +"<p id='sr_settings_para_2'>1.0</p>"
            +"<p id='sr_settings_para_3'>Open</p>"
            +"<p id='sr_settings_para_4'>Closed</p>"
        +"</div>"
    +"</div>";

    document.body.insertBefore(settingsDiv,frameDiv);
}

function changeSettingsDisplay(){
    let settingsDiv = document.getElementById("screen-reader-settings-display");
    settingsDiv.style.left = (window.innerWidth/2 - 300) +"px";
    settingsDiv.style.top = (window.innerHeight/2 - 200) +"px";
}

function displaySettings(){
    let settingsDiv = document.getElementById("screen-reader-settings-display");
    settingsDiv.style.display = "block";

    currentStage = 1;
    if(isTutorial){
        settingsDiv.style.zIndex = "2147483647";
    }
    else{
        settingsDiv.style.zIndex = "2147483646";
    }

    chrome.runtime.sendMessage({isSetting:1});
}

function closeSettings(){
    if(isTutorial){
        currentStage = 2;
        chrome.runtime.sendMessage({isSetting:3});// to tutorial
    }
    else{
        currentStage = 0;
        chrome.runtime.sendMessage({isSetting:2}); // to screen reader
    }

    let settingsDiv = document.getElementById("screen-reader-settings-display");
    settingsDiv.style.display = "none";
}

function settingsControl(){
    isSetting = !isSetting;
    if(isSetting){
        // open settings
        displaySettings();

        // select current selection
        settingItem = 1;
        for(let i=1;i<5;i++){
            let tempItem = document.getElementById("sr_settings_para_"+i)
            if(i==settingItem){
                tempItem.style.border = "red 2px solid";
            }
            else{
             tempItem.style.border = "none";
            }
        }
    }
    else{
        // close settings
        closeSettings();
    }
}

function settingLeft(){
    //currently 4 items: rate, volume, keyboard control, voice control
    if(settingItem > 1){
        settingItem -= 1;
    }else{
        settingItem = 4;
    }
    for(let i=1;i<5;i++){
       let tempItem = document.getElementById("sr_settings_para_"+i)
       if(i==settingItem){
           tempItem.style.border = "red 2px solid";
       }
       else{
        tempItem.style.border = "none";
       }
    }
    chrome.runtime.sendMessage({
        settingItem:settingItem,
        speechRate:speechRate,
        speechVolume:speechVolume,
        useVoice:useVoice,
        useKeyboard:useKeyboard
    });
}

function settingRight(){
    if(settingItem < 4){
        settingItem+=1;
    }else{
        settingItem = 1;
    }
    for(let i=1;i<5;i++){
        let tempItem = document.getElementById("sr_settings_para_"+i)
        if(i==settingItem){
            tempItem.style.border = "red 2px solid";
        }
        else{
         tempItem.style.border = "none";
        }
     }
    chrome.runtime.sendMessage({
        settingItem:settingItem,
        speechRate:speechRate,
        speechVolume:speechVolume,
        useVoice:useVoice,
        useKeyboard:useKeyboard
    });
}

function settingDown(){//Minus
    let needNotify = false;
    switch(settingItem){
        case 1://rate
            if(speechRate>0.5) speechRate-=0.1;
            speechRate = Math.round(speechRate*10)/10;
            let sr_para = document.getElementById("sr_settings_para_1")
            sr_para.innerHTML = speechRate.toFixed(1);
            break;
        case 2://volume
            if(speechVolume>0.2) speechVolume-=0.1;
            speechVolume = Math.round(speechVolume*10)/10;
            let sv_para = document.getElementById("sr_settings_para_2");
            sv_para.innerHTML = speechVolume.toFixed(1);
            break;
        case 3://keyboard control
            if(useVoice == false) // at least one should open
            {
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }
            if(useVoice == true){
                useKeyboard = !useKeyboard;
                let kc_para = document.getElementById("sr_settings_para_3");
                if(useKeyboard){
                    kc_para.innerHTML = "Open";
                }
                else{
                    kc_para.innerHTML = "Closed"
                }
            }
            break;
        case 4://voice control
            if(useKeyboard == false){
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }   
            if(useKeyboard == true){
                useVoice = !useVoice;
                let vc_para = document.getElementById("sr_settings_para_4");
                if(useVoice){
                    vc_para.innerHTML = "Open";
                }
                else{
                    vc_para.innerHTML = "Closed"
                }
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
function settingUp(){//Add
    let needNotify = false;
    switch(settingItem){
        case 1://rate
            if(speechRate<2.0) speechRate+=0.1;
            speechRate = Math.round(speechRate*10)/10;
            let sr_para = document.getElementById("sr_settings_para_1")
            sr_para.innerHTML = speechRate.toFixed(1);
            break;
        case 2://volume
            if(speechVolume<1.0) speechVolume+=0.1;
            speechVolume = Math.round(speechVolume*10)/10;
            let sv_para = document.getElementById("sr_settings_para_2");
            sv_para.innerHTML = speechVolume.toFixed(1);
            break;
        case 3://keyboard control
            if(useVoice == false)
            {
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }
            if(useVoice == true){
                useKeyboard = !useKeyboard;
                let kc_para = document.getElementById("sr_settings_para_3");
                if(useKeyboard){
                    kc_para.innerHTML = "Open";
                }
                else{
                    kc_para.innerHTML = "Closed"
                }
            }
            break;
        case 4://voice control
            if(useKeyboard == false){
                chrome.runtime.sendMessage({needNotify:true});
                needNotify = true;
            }   
            if(useKeyboard == true){
                useVoice = !useVoice;
                let vc_para = document.getElementById("sr_settings_para_4");
                if(useVoice){
                    vc_para.innerHTML = "Open";
                }
                else{
                    vc_para.innerHTML = "Closed"
                }
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

