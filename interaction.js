var expand=document.getElementById("expand");
var shrink = document.getElementById("shrink");

// Expand the window size to large size
expand.addEventListener("click",(e)=>{
    document.body.style.width="1600px";
    document.body.style.height="1000px";
})

// Shrink to fixed small size
shrink.addEventListener("click",(e)=>{
    document.body.style.width="300px";
    document.body.style.height="200px";
})