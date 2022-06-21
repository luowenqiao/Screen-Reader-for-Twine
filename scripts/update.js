/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */
/* ----------------------------   Update Listener   --------------------------- */
/* ---------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------- */

function updateListener(){
    // SugarCube: 
    //  div#passage: whole page change
    //  other nodes: content change

    // inpage: Removed content: xxx, added content: xxx, currently you are located at
    // whole passage
    
    let observer = new MutationObserver((mutations) => {
        var targetNodes = [];
        var rmvNodes = [];
        var addNodes = [];

        //console.log(mutations)
        mutations.forEach((mutation) => {

            // target node
            if(targetNodes.indexOf(mutation.target) == -1 
            && mutation.target.nodeName != "TW-TRANSITION-CONTAINER"){
                targetNodes.push(mutation.target)
            }

            // removed nodes
            if(mutation.removedNodes.length>0){
                let shouldRemove = true;
                let tempRmvNodes = [];
                if(mutation.target && mutation.target.nodeName == "TW-TRANSITION-CONTAINER")
                {   shouldRemove = false;  }
                if(mutation.previousSibling && mutation.previousSibling.nodeName == "TW-TRANSITION-CONTAINER")
                {   shouldRemove = false;  }
                mutation.removedNodes.forEach((n) =>{
                    if( n.nodeName == "TW-TRANSITION-CONTAINER"){
                        shouldRemove = false;
                    }
                })
                mutation.addedNodes.forEach((n) =>{
                    if( n.nodeName == "TW-TRANSITION-CONTAINER"){
                        shouldRemove = false;
                    }
                })

                if(shouldRemove){
                    // the candidate nodes
                    mutation.removedNodes.forEach((m) =>{
                        let willRemove = true;
                        // the already added nodes
                        rmvNodes.forEach((nList)=>{
                            if(nList.indexOf(m.parentNode) != -1){
                                willRemove = false;
                            }
                        })
                        if(willRemove)
                            tempRmvNodes.push(m)
                    })
                }

                if(tempRmvNodes.length>0 ){
                    rmvNodes.push(tempRmvNodes);
                }
            }

            // added nodes
            if(mutation.addedNodes.length>0){
                let shouldAdd = true;
                let tempAddNodes = [];
                if(mutation.target && mutation.target.nodeName == "TW-TRANSITION-CONTAINER")
                {   shouldAdd = false;  }
                if(mutation.previousSibling && mutation.previousSibling.nodeName == "TW-TRANSITION-CONTAINER")
                {   shouldAdd = false;  }
                mutation.removedNodes.forEach((n) =>{
                    if( n.nodeName == "TW-TRANSITION-CONTAINER"){
                        shouldAdd = false;
                    }
                })
                mutation.addedNodes.forEach((n) =>{
                    if( n.nodeName == "TW-TRANSITION-CONTAINER"){
                        shouldAdd = false;
                    }
                })

                if(shouldAdd){
                    // the candidate nodes
                    mutation.addedNodes.forEach((m) =>{
                        // let willAdd = true;
                        // // the already added nodes
                        // addNodes.forEach((nList)=>{
                        //     if(nList.indexOf(m.parentNode) != -1){
                        //         willAdd = false;
                        //     }
                        // })
                        // if(willAdd)
                            tempAddNodes.push(m)
                    })
                }

                if(tempAddNodes.length>0 ){
                    addNodes.push(tempAddNodes);
                }

            }
        });

        // delete child nodes
        for(let i=addNodes.length-1;i>0;i--){
            addNodes[i].forEach((n)=>{
                addNodes.forEach((mList)=>{
                    if(mList.indexOf(n.parentNode)!=-1){
                        addNodes.splice(i,i+1)
                    }
                })
            })
        }

        if(storyFormat == "SugarCube"){
            storyContent = document.getElementById("passages")
            if(targetNodes[0].id=="passages"){
                // whole page change
                currentContent = storyContent
                chrome.runtime.sendMessage({updateInfo:1})
            }
            else{
                // in-page change
                inPageUpdate(targetNodes[0],rmvNodes,addNodes);
            }
        }
        if(storyFormat == "Harlowe"){
            storyContent = document.querySelector("tw-passage");
            if(targetNodes[0].nodeName == "TW-PASSAGE"){
                // whole page change
                currentContent = storyContent
                chrome.runtime.sendMessage({updateInfo:1})
            }else{
                // in-page change
                if(addNodes[0][0].nodeName != "TW-PASSAGE"){
                    console.log(addNodes)
                    inPageUpdate(targetNodes[0],rmvNodes,addNodes);
                }
            }
        }

        interactableNodes = getInteractableNodes();
        notificationSound.play();
        changeDisplay();
    });

    if( storyFormat == "SugarCube"){
        observer.observe(document.getElementById("passages"), {
            characterDataOldValue: true, 
            subtree: true, 
            childList: true, 
            characterData: true
        });
    }
    if( storyFormat == "Harlowe"){
        observer.observe(document.querySelector("tw-story"), {
            characterDataOldValue: true, 
            subtree: true, 
            childList: true, 
            characterData: true
        });
    }
}

function inPageUpdate(targetNode,rmvNodes,addNodes){
    currentContent = targetNode
    let txt = [];
    let index = 1;
    let re = new RegExp(/[a-zA-Z0-9]/) // to check if there is sth to read
    rmvNodes.forEach((nList) =>{
        let tempTextList = [];
        nList.forEach((n)=>{
            let tempText = getContent(n);
            let shouldAdd = false;
            if(tempText.length>0){
                for(let i =0;i<tempText.length/2;i++){
                    if(re.test(tempText[2*i+1])){
                        shouldAdd = true;
                        break;
                    }
                }
                if(shouldAdd){
                    tempTextList = tempTextList.concat(tempText);
                }
            }
        })
        if(tempTextList.length>0){
            txt=txt.concat(["A","Previous Content"+index])
            txt=txt.concat(tempTextList)
            index++;
        }
    })
    index = 1;
    addNodes.forEach((nList) =>{
        let tempTextList = [];
        nList.forEach((n)=>{
            let tempText = getContent(n);
            let shouldAdd = false;
            if(tempText.length>0){
                for(let i =0;i<tempText.length/2;i++){
                    if(re.test(tempText[2*i+1])){
                        shouldAdd = true;
                        break;
                    }
                }
                if(shouldAdd){
                    tempTextList = tempTextList.concat(tempText);
                }
            }
        })
        if(tempTextList.length>0){
            txt=txt.concat(["A","New Content"+index])
            txt=txt.concat(tempTextList)
            index++;
        }
    })

    txt = txt.concat("A","You are currently selecting. ")
    txt = txt.concat(getContent(currentContent));
    chrome.runtime.sendMessage({updateInfo:2,textToRead:txt})
}