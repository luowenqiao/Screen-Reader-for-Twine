chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = "Start Reading...";
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(request.source);
    // utterThis.onend = function (event) {
    //     console.log('SpeechSynthesisUtterance.onend');
    // }
    // utterThis.onerror = function (event) {
    //     console.error('SpeechSynthesisUtterance.onerror');
    // }

    utterThis.voice = synth.getVoices()[0];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis); 
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getTwineSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;