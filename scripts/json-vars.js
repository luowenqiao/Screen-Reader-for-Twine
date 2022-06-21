// For story formatting
var storyFormat, storyContent;

// For storing selection positions
var currentContent;

// For key setting
var systemName;

// Feedback Sounds
var notificationSound = new Audio();
notificationSound.src = "data:audio/wav;base64,"+notificationSrc;
var directionSound = new Audio();
directionSound.src = "data:audio/mp3;base64,"+directionSrc;

// For settings, set to default
var currentStage = 0; // 0 - screen reader, 1 - settings, 2 - tutorial
var isSetting = false;
var isTutorial = false;

var speechRate = 1.0;
var speechVolume = 1.0;
var useKeyboard = true;
var useVoice = false;

// item index for sending message to background.js for read out
var settingItem = 1;
var tutorialItem = 0;

// index and array to record the interactable elements on the current page
var currentInteract = 0;
var interactableNodes;

// For tutorials
var tutorialUrl = "https://luowenqiao.github.io/Screen-Reader-for-Twine/tutorial.html";

// Tag parsing
var nodeToText = {
    // basic html
    "TITLE":"title",
    "H1":"heading level 1",
    "H2":"heading level 2",
    "H3":"heading level 3",
    "H4":"heading level 4",
    "H5":"heading level 5",
    "H6":"heading level 6",
    "P":"paragraph",
    //"BR":" "this could ignore the br
    "HR":"horizontal rule",

    // formatting
    "B":"bold",
    "BLOCKQUOTE":"blockquote",
    "CODE":"code",
    "EM":"emphasis",
    "I":"italic",
    "PRE":"preformatted text",
    "S":"strikethrough",
    "STRONG":"strong",
    "SUP":"superscript",
    "SUB":"subscript",
    "U":"underline",

    // forms and input
    "FORM":"form",
    "INPUT":"input",
    "TEXTAREA":"textarea",
    "BUTTON":"button",
    "SELECT":"drop down list",
    "OPTGROUP":"option group",
    "OPTION":"option",
    
    // images
    "IMG":"image",
    "SVG":"scalable vector graphics",

    // audio & video
    "VIDEO":"video",
    "AUDIO":"audio",

    // links
    "A":"link",
    "LINK":"link",

    // lists
    "UL":"unordered list",
    "OL":"ordered list",
    "LI":"list item",

    // tables
    "TABLE":"table",
    "TH":"table header",
    "TR":"table row",
    "TD":"table cell",
    "THEAD":"table head",
    "TFOOT":"table footer",
    "TBODY":"table body",

    // styles & semantics
    "DIV":"",
    "SPAN":"",

    //especially for Harlowe
    "TW-STORY":"",
    "TW-PASSAGE":"",
    "TW-LINK":"link",
    "TW-EXPRESSION":"",
    "TW-HOOK":"",
    "TW-ALIGN":"",
    "TW-ENCHANTMENT":"link",
    "TW-INCLUDE":"",
    "TW-SIDEBAR":"side bar",
    "TW-ICON":"icon",
    "TW-COLLAPSED":""
}

