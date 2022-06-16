// background.js
// Run as console

// for settings
// item: rate, volume, keyboard control, voice control
var speechRate,speechRate,keyboardControl,voiceControl;
var items=[
  "Currently selecting: Speaking rate, from zero point five to two point zero, each step is point one. Current rate is: ",
  "Currently selecting: Speaking Volume, from zero point one to one, each step is point one. Current volume is: ",
  "Currently selecting: Open or close the keyboard control, currently is ",
  "Currently selecting: Open or close the voice control, currently is ",
];

// for tutorial
var tutorialUrl = "https://luowenqiao.github.io/Screen-Reader-for-Twine/tutorial.html";

// Run when chrome installed
chrome.runtime.onInstalled.addListener(() => {

  console.log('background.js and document are loaded');

  // Default setting for once when opened
  chrome.storage.sync.set({
    speechRate: 1.0,
    speechVolume:1.0,
    keyboardControl: true,
    voiceControl: false
  });
  
  // Speak initial
  normalSpeak(
    "Screen reader for Twine is activated. " +
    "The screen reader will work when it detects Twine game."
  );

});

// Run when content-script sends message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // Start the screen reader when Twine page detected, tutorial
    // message {situation: String}
    if(request.situation && request.situation == "start"){
      chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
        if(tabs[0].url == tutorialUrl){
          normalSpeak(
            "Welcome to the screen reader for Twine games tutorial. " +
            "You can press Command, Shift, and Space to start or stop reading."
          );
        }else{
          normalSpeak(
            'Twine game detected. '
            + 'To open the tutorial, press Command, Shift, and One. '
            + 'To open or close the settings, press Command, Shift, and "S". '
            + 'To start or stop reading, press Command, Shift, and Space. ',
          );
        }
      });
    }

    // Read out the content
    // message {textToRead: String, enqueueBool: Bool}
    if(request.textToRead){
      speakContent(request.textToRead)
    }

    // Start/Stop reading
    // message {stop: Bool, currentRead: String}
    if(request.stop){
      // let isSpeaking;
      chrome.tts.isSpeaking(
        function (speaking){
          if(speaking){
            chrome.tts.stop();
          }
          else{
            speakContent(request.currentRead);
          }
        }
      )
    }

    // Open/Close setting
    if(request.isSetting==1){
      chrome.storage.sync.get(['speechRate'], function(result) {
        normalSpeak(
          "Settings is opened. " +
          "Use Command, Shift, Left or Right to select items, " +
          "use Command, Shift, Up or Down to modify them. "
          + items[0] + result.speechRate
        );
      });
      
    }
    if(request.isSetting==2){
      normalSpeak(
        "Settings is closed. Screen reader is on."
      )
    }
    if(request.isSetting == 3){
      normalSpeak(
        "Settings is closed. Tutorial is on."
      )
    }

    // Settings & change storage
    if(request.settingItem == 1){// speech rate
      chrome.storage.sync.set({speechRate:request.speechRate})
      normalSpeak(items[request.settingItem-1]+request.speechRate)
    }
    if(request.settingItem == 2){ // speech volume
      chrome.storage.sync.set({speechVolume:request.speechVolume})
      normalSpeak(items[request.settingItem-1]+request.speechVolume)
    }
    if(request.settingItem==3){ // keyboard control
      chrome.storage.sync.set({keyboardControl:request.useKeyboard})
      let appendText = request.useKeyboard?" opening.":" closed."
      normalSpeak(items[request.settingItem-1]+appendText)
    }
    if(request.settingItem==4){ // voice control
      chrome.storage.sync.set({voiceControl:request.useVoice})
      let appendText = request.useVoice?" opening.":" closed."
      normalSpeak(items[request.settingItem-1]+appendText)
    }

    // Tutorial
    if(request.isTutorial == 1){
     normalSpeak("Welcome to the screen reader for Twine tutorial. "
     +"You can press Command, Shift, One at any time to go back to the game. "
     +"Press Command, Shift, Space to start or stop reading.")
    }
    if(request.isTutorial == 2){
      normalSpeak("Tutorial is closed. Screen reader is on.")
    }
    if(request.isTutorial == 3){
      normalSpeak("Tutorial is closed. Settings is on.")
    }


    // Tutorial
    if(request.openTutorial){
      chrome.windows.create({ url: tutorialUrl, type: 
    "normal", height : 800, width : 1500 });
    }
    if(request.closeTutorial){
      chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
        chrome.tabs.remove(tabs[0].id);
        chrome.tts.stop();
      });
    }

    if(request.tutorialItem == 0){
      chrome.tts.isSpeaking(
        function (speaking){
          if(speaking){
            chrome.tts.stop();
          }
          else{
            normalSpeak("This is an example sentence. "
            +"You can press Command, Shift, Arrow Left or Arrow Right to select the content.")
          }
        }
      )
    }
  }
);

function speakContent(textToRead){
  if(textToRead.length>0){
    chrome.storage.sync.get(['speechRate','speechVolume'], function(result) {
      chrome.tts.speak(textToRead[1],
      {
        "rate":result.speechRate,
        "volume":result.speechVolume,
        "voiceName": textToRead[0]=="B"?"Alex":"Samantha",
      })
    });
    for(let i=1;i<textToRead.length/2;i++){
      chrome.storage.sync.get(['speechRate','speechVolume'], function(result) {
        chrome.tts.speak(textToRead[2*i+1],
        {
          "rate":result.speechRate,
          "volume":result.speechVolume,
          "voiceName": textToRead[2*i]=="B"?"Alex":"Samantha",
          "enqueue":true
        })
      });
    }
  }
}

function normalSpeak(content){
  chrome.storage.sync.get(['speechRate','speechVolume'], function(result) {
    chrome.tts.speak(content,{
      "rate":result.speechRate,
      "volume":result.speechVolume
    })
  });
}
