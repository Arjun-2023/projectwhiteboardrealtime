
let pencilElement = document.querySelector("#pencil");
let eraserElement = document.querySelector("#eraser");
let StickyElement = document.querySelector("#sticky");
let uploadElement = document.querySelector("#upload");
let downloadElement = document.querySelector("#download");
let undoElement = document.querySelector("#undo");
let redoElement = document.querySelector("#redo");

/*
pencilElement.addEventListener("click", function tellPencil() {
    console.log("Pencil is clicked");
});
eraserElement.addEventListener("click", function tellEraser() {
    console.log("eraser is clicked");
});
StickyElement.addEventListener("click", function tellSticky() {
    console.log("sticky is clicked");
});
uploadElement.addEventListener("click", function tellUpload() {
    console.log("upload is clicked");
});
downloadElement.addEventListener("click", function tellDownload() {
    console.log("download  is clicked");
});
undoElement.addEventListener("click", function tellUndo() {
    console.log("undo is clicked");
});
redoElement.addEventListener("click", function tellRedo() {
    console.log("redo is clicked");
});
*/

// tool selector logic*******************

let toolBarArr = document.querySelectorAll(".tool");

let currentTool ="pencil";
for(let i =0;i<toolBarArr.length;i++){
    toolBarArr[i].addEventListener("click", function(){
       // console.log(toolBarArr[i].id);
       const toolName = toolBarArr[i].id;
       if(toolName == "pencil"){
            currentTool = "pencil";
            tool.strokeStyle = "blue";
       }else if(toolName == "eraser" ){
              currentTool = "eraser";
              tool.strokeStyle = "white";
              tool.lineWidth = 10
       }else if(toolName == "sticky"){
            currentTool = "sticky";
             createSticky();
       }else if(toolName == "upload"){
            currentTool = "upload";
            console.log("upload files here");
            uploadFile();
       }else if(toolName == "download"){
        currentTool = "download";
        downloadFile();
       }else if(toolName == "undo"){
        currentTool = "undo";
        undoFn();
       }else if(toolName == "redo"){
        currentTool = "redo";
        redoFn();
       }

    })
}


//select canvas tag

let canvas = document.querySelector("#board");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//let tool = canvas.getContext("2d");
//draw on canvas anything

let tool = canvas.getContext("2d");
// path draw something on canvas
/*
// ** pathdraw
tool.beginPath(); //you want to start the drawig path part
// starting point of drawing
tool.moveTo(20, 200);
//ending point of the line is
tool.lineTo(400,150);
//when stoke is called , it will draw the line
tool.stroke();

// /****path2 **

tool.beginPath();
// colour change
tool.strokeStyle = "red";
tool.lineWidth = 5;
tool.moveTo(100, 300);
tool.lineTo(200, 100);
tool.stroke();

console.log("toollllll", tool);


*/

// line implementation
//mouse , canvas -> press(starting point)
//mouse , canvas -> lift(ending point)


let undoStack =[];
let redoStack =[];
let isDrawing = false;

canvas.addEventListener("mousedown", function(e){
    let sidx = e.clientX;
    let sidy = e.clientY;
    //drawing will start
    tool.beginPath();

    let toolBarHeight = getYdelta();
    //jha se presss
    tool.moveTo(sidx,sidy- toolBarHeight);

    isDrawing = true;

    // we create  undo functione here  and as you draw store or  we save coordinates in stack
    //canvas function -> ?? -> no
    //so we have to implement our own logic 
    //while drawing -> store the point 
    // when u click on undo
    //*clearRect()-> clear
    //*undo-> last point remove storage
    //*redraw
    let pointDesc = {
        x: sidx,
        y :sidy-toolBarHeight,
        desc : "md"

    }

    //last mae add  krna he.
    undoStack.push(pointDesc);


})

canvas.addEventListener("mousemove", function(e){
  //  console.log("mouse move", e.clientX, e.clientY);
  let eidx = e.clientX;
  let eidy = e.clientY;

  let toolBarHeight = getYdelta();
  if(isDrawing==false) return ;

  //drawing will start
  tool.lineTo(eidx,eidy-toolBarHeight);
  //jha se presss
  tool.stroke();

  //undo function her we save coordinates
    let pointDesc ={
        x: eidx,
        y:eidy-toolBarHeight,
        desc : "mm"
    }
    //last mae add  krna
    undoStack.push(pointDesc);
  
})

canvas.addEventListener("mouseup", function(e){
    isDrawing = false;
})


let toolBar = document.querySelector(".toolbar");
function getYdelta(){
    let heightOfToolbar = toolBar.getBoundingClientRect().height;
    return heightOfToolbar;
}

// create common outer shell and sticky note implementation

//1. static version ->
//2. how it will be added to your ui
//3. how it will be functionality

//<div class = "sticky ">
//<div class = "nav">
 //   <div class = "close">X</div>
 //   <div class = "minimize">min</div>
//</div>
//    <textarea name=" " class = "text-area" id = " ">write here</textarea>

//</div>
// create element

function createOuterShell(){
    let stickyDiv = document.createElement("div");
    let navDiv = document.createElement("div");
    let closeDiv = document.createElement("div");
    let minimizeDiv = document.createElement("min");
    

    //class styling
    stickyDiv.setAttribute("class", "sticky");
    navDiv.setAttribute("class", "nav");
    closeDiv.setAttribute("class", "close");
    minimizeDiv.setAttribute("class", "minimize" );
   

    closeDiv.innerText = "X";
    minimizeDiv.innerText = "min";

    //html structure
    stickyDiv.appendChild(navDiv);
    //stickyDiv.appendChild(textArea);
    navDiv.appendChild(minimizeDiv);
    navDiv.appendChild(closeDiv);
    //page mae add krna
    document.body.appendChild(stickyDiv);

   // functionality for sticky note
   
   let isMinimized = false;
   closeDiv.addEventListener("click", function(){
     stickyDiv.remove();
   })

   minimizeDiv.addEventListener("click", function(){
    textArea.style.display = isMinimized == true? "block": "none";
        isMinimized = !isMinimized;
    })


    let isStickyDown = false;
    let initialX ;
    let initialY;

// navbar -> mouse down, mousemove, mouse up

navDiv.addEventListener("mousedown", function (e){
    //initial point
     initialX = e.clientX;
     initialY = e.clientY;
    console.log("mousedown", initialX, initialY);
    isStickyDown= true;
});

navDiv.addEventListener("mousemove", function(e){
    if(isStickyDown==true){
        let finalX = e.clientX;
        let finalY = e.clientY;
        console.log("mousemove", finalX,finalY);
        //distance findout
        let dx = finalX-initialX;
        let dy = finalY-initialY;
        //movesticky
        //originalTopLeft
        let {top, left} = stickyDiv.getBoundingClientRect();
        stickyDiv.style.top = top+dy+ "px";
        stickyDiv.style.left = left  + dx + "px";
        initialX = finalX;
        initialY = finalY;
    }
   // return stickyDiv;
})

navDiv.addEventListener("mouseup", function(e){
    isStickyDown = false;
   // 
})
 return stickyDiv;
}

function createSticky(){
    let stickyDiv = createOuterShell();
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "text-area");
    stickyDiv.appendChild(textArea);

    
} 
    
//////////////////////////////
//////////////////////////////

// uload file
// 1. we need input tag in html file -> file(input type "file")-hide it
//2. click image icon->
//3. input tag click -> input tag will take the input
//4. file read input tag
//5. add ui
let inputTag = document.querySelector(".input-tag");
function uploadFile(){
    
    //console.log("uploadFile");
   // click image icon->
    
    //input tag click -> input tag will take the input
    inputTag.click();
    console.log("upload files is clicked");

    //file read input tag it check content here
    inputTag.addEventListener("change", function(){
        let data =  inputTag.files[0] ;

        // 5. add UI
        let img = document.createElement("img");
        //src ->file url
        let url = URL.createObjectURL(data);
        //console.log("url", url )
          img.src = url;
        // give styling
        img.setAttribute("class", "upload-img");
        
        // 6.  add to body
       // document.body.appendChild(img);
       let stickyDiv = createOuterShell();
       stickyDiv.appendChild(img);


    })
}

//download file function

function downloadFile(){
    //create anchor button
    //href == canvas which is converting into url
    //anchor click();
    //anchor button
    // add download attribute in html

    let a = document.createElement("a");
    a.download = "file.jpeg";
    let url = canvas.toDataURL("img/jpeg:base64");
    //set as href of anchor
    a.href = url;
    //click the anchor
    a.click();
    //remove anchor
    a.remove();



}

//possibilities for undo
//store point
//last point remove storage
//clean
//redraw
function undoFn(){
//clearRect() is a canvas api.
 tool.clearRect(0,0,canvas.width, canvas.height);
 //pop
 if(undoStack.length>0){
    redoStack.push(undoStack.pop());
    //last removal
    //redraw
    for(let i = 0; i<undoStack.length;i++){
        let {x, y , desc} = undoStack[i];
        if(desc =="md"){
            tool.beginPath();
            tool.moveTo(x,y);
        
        }else if(desc == "mm"){
            tool.lineTo(x,y);
            tool.stroke();
        }
    }
 }
}
// in redo we used undo wala logic

function redoFn(){
    //clearRect() is a canvas api.
     

     //pop
     if(redoStack.length>0){
        tool.clearRect(0,0,canvas.width, canvas.height);
        undoStack.push(redoStack.pop());
        //last removal
        //redraw
        for(let i = 0; i<undoStack.length;i++){
            let {x, y , desc} = undoStack[i];
            if(desc =="md"){
                tool.beginPath();
                tool.moveTo(x,y);
            
            }else if(desc == "mm"){
                tool.lineTo(x,y);
                tool.stroke();
            }
        
        }    
    }
}    
