String.prototype.splice = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};

function DOMtoString(document_root) {
    var documentData = document_root.getElementsByTagName("tw-storydata");
    var storyType = documentData[0].getAttribute("format");
    switch(storyType){
        case "SugarCube":
        {
            var documentSugarCube = document_root.getElementById("passages");
            var html = documentSugarCube.children[0].innerText;
            var linkList=recursiveDOM(documentSugarCube);

            for(let i=0;i<linkList.length;i++){
                if(html.indexOf(linkList[i])!=-1){
                    html=html.splice(html.indexOf(linkList[i]), ',link,');
                }
            }
            return html;
        }
        case "Harlowe":
        {
            var documentHarlowe = document_root.getElementsByTagName("tw-passage");
            var html = documentHarlowe[0].innerText;
            var linkList=recursiveDOM_Harlowe(documentHarlowe[0]);

            console.log(html);
            for(let i=0;i<linkList.length;i++){
                if(html.indexOf(linkList[i])!=-1){
                    html=html.splice(html.indexOf(linkList[i]), ',link,');
                }
            }
            return html;
        }    
        default:
            return '';
    }
}

function recursiveDOM(doc_root){
    var linkList = [];
    if(doc_root){
        if(doc_root.className == "link-internal"){
            linkList.push(doc_root.innerText);
        }
        if(doc_root.children){
            for (let i = 0; i < doc_root.children.length; i++) {
                var childList = recursiveDOM(doc_root.children[i]);
                if(childList){
                    for(let j=0;j<childList.length;j++){
                        linkList.push(childList[j]);
                    }
                }
            }
        }
    }
    return linkList;
}


function recursiveDOM_Harlowe(doc_root){
    var linkList = [];
    if(doc_root){
        if(doc_root.tagName == "TW-LINK"){
            linkList.push(doc_root.innerText);
        }
        if(doc_root.children){
            for (let i = 0; i < doc_root.children.length; i++) {
                var childList = recursiveDOM_Harlowe(doc_root.children[i]);
                if(childList){
                    for(let j=0;j<childList.length;j++){
                        linkList.push(childList[j]);
                    }
                }
            }
        }
    }
    return linkList;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});