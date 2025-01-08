function openPopUp() {
    popUp.style.display = "block";
}
function closePopUp() {
    popUp.style.display = "none";
    nameInput.value = "";
}

function download(data, filename, type) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function loadFile() {
    let sidebar = Array.from(category("sidebar"));
    let f = document.createElement('input');
    f.style.display = "none";
    f.type = "file";
    f.name = "file";
    f.onchange = e => { 
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!
            types = JSON.parse(content)[0];
            let blocks = JSON.parse(content)[1];
            sidebar[0].regenerate();
            for(let i=0; i<blocks.length; i++) {
                if(blocks[i].type == "segment") {
                    add(new Segment(blocks[i].x, blocks[i].y, blocks[i].data))
                } else if(blocks[i].type == "LED") {
                    add(new LED(blocks[i].x, blocks[i].y, blocks[i].data))
                } else {
                    add(new defaultBlock(blocks[i].x, blocks[i].y, blocks[i].type, blocks[i].data))
                }
            }
            console.log(sortedEntities)
        }
    }
    f.accept = "application/json"
    document.body.appendChild(f);
    f.click();
}

window.onclick = function(event) {
    if (event.target == popUp) {
        closePopUp()
    }
}

colourInput.onchange = function() {
	colourPickerWrapper.style.backgroundColor = colourInput.value;    
}
colourPickerWrapper.style.backgroundColor = colourInput.value;