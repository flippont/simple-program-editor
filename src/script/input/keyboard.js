let DOWN = {};
onkeydown = e => {
    if (e.ctrlKey && e.key == 's') {
        e.preventDefault()
        let saveItem = [];
        saveItem.push(types);
        saveItem.push(generateBlocksArray())
        download(JSON.stringify(saveItem, null, " "), "circuit", "application/json")
    }
    if (e.ctrlKey && e.key == 'l') {
        e.preventDefault()
        loadFile();
    }    
    DOWN[e.keyCode] = true
};
onkeyup = e => DOWN[e.keyCode] = false;

// Reset inputs when window loses focus
onblur = onfocus = () => {
    DOWN = {};
    MOUSE_RIGHT_DOWN = MOUSE_DOWN = false;
};