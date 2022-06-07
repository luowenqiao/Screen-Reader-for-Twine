// background.js
// Run as console

// for settings
// item: voice control, rate, volume, keyboard control
var items=[
  "Open or close the voice control, currently is ",
  "Speaking rate, from zero point five to two point zero, each step is point one. Current rate is: ",
  "Speaking Volume, from zero point one to one, each step is point one. Current volume is: ",
  "Open or close the keyboard control, currently is "
];

// Run when chrome installed
chrome.runtime.onInstalled.addListener(() => {

  console.log('background.js and document are loaded');
  chrome.tts.speak("Screen reader for Twine is activated. The screen reader will work when it detects Twine game.")
});

// Run when content-script sends message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // Start the screen reader when Twine page detected, tutorial
    // message {situation: String}
    if(request.situation && request.situation == "start"){
      chrome.tts.speak(
        'Twine game detected. '
        +'To open or close the settings, press "Z". '
        +'To start or stop reading, press "Space". '
      );
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
      chrome.tts.speak("Settings is opened. Use Up and Down to select items, use left and right to modify them.")
    }
    if(request.isSetting==0){
      chrome.tts.speak("Settings is closed. Screen reader is on.")
    }

    // Settings
    if(request.settingItem == 2){
      chrome.tts.speak(items[request.settingItem-1]+request.speechRate)
    }
    if(request.settingItem == 3){
      chrome.tts.speak(items[request.settingItem-1]+request.speechVolume)
    }
    if(request.settingItem==4){
      let appendText = request.useKeyboard?" opening.":" closed."
      chrome.tts.speak(items[request.settingItem-1]+appendText)
    }
    if(request.settingItem==1){
      let appendText = request.useVoice?" opening.":" closed."
      chrome.tts.speak(items[request.settingItem-1]+appendText)
    }

    // Tutorial
    if(request.openTutorial){
      chrome.windows.create({ url: "https://luowenqiao.github.io/Screen-Reader-for-Twine/tutorial.html", type: 
    "normal", height : 800, width : 500 });
      //chrome.tts.speak("Welcome to the screen reader for Twine game tutorial.")
    }
  }
);

function speakContent(textToRead){
  if(textToRead.length>0){
    chrome.tts.speak(
      textToRead[1],
      {
        "voiceName": textToRead[0]=="\\&"?"Alex":"Samantha"
      }
    )
    for(let i=1;i<textToRead.length/2;i++){
      chrome.tts.speak(
        textToRead[2*i+1],
        {
          "voiceName": textToRead[2*i]=="\\&"?"Alex":"Samantha",
          "enqueue":true
        }
      )
    }
  }
}
