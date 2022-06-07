// For story formatting
var storyFormat, storyContent;

// For storing selection positions
var currentContent;

// Feedback Sounds
var notificationSound = new Audio();
notificationSound.src = "data:audio/wav;base64,"+notificationSrc;
var directionSound = new Audio();
directionSound.src = "data:audio/mp3;base64,"+directionSrc;

// For settings, set to default
var speechRate = 1.0;
var speechVolume = 1.0;
var isSetting = false;
var useKeyboard = true;
var useVoice = false;
var settingItem = 1;

// Tag parsing
var nodeToText = {
    // basic html
    "TITLE":"title",
    "H1":"heading 1",
    "H2":"heading 2",
    "H3":"heading 3",
    "H4":"heading 4",
    "H5":"heading 5",
    "H6":"heading 6",
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
    "SVG":"svg image",

    // audio & video
    "VIDEO":"video",

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
    "TW-INCLUDE":""
}

