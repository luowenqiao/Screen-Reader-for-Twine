// The script starts when the page loading is complete
document.onreadystatechange = function () {
    if(document.readyState == "complete")
    {
        // wait another 1s for the page to load
        main();
    }
}

// The main process of the screen reader
function timeout (ms) {
    return new Promise(res => setTimeout(res,ms));
}
async function main(){

    await timeout(1000);

    // Executes when the page is Twine game
    if(isTwinePage()){

        // Display UI selesction
        frameDisplay()

        // Start Message (tutorial)
        chrome.runtime.sendMessage({situation: "start"});

        // Keyboard Controls
        keyboardControl();

        // Voice Control
        voiceControl();

        // Page Update Listener
        updateListener();
    }
}