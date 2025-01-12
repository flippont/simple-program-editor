function addSaveData(name) {
    let saveValue = {
        name: name,
        data: [],
        blocks: []
    }
    saveData.push(saveValue);
    currentSaveFile = saveData.length - 1;
    localStorage.setItem("saveData", JSON.stringify(saveData))
    changeScene("play")
    saveCurrentState()
}

function saveCurrentState() {
    let blocks = Array.from(category("blocks"));
    let data = [];
    for(let i=0; i<blocks.length; i++) {
        let currentData = {
            x: Math.floor(blocks[i].x),
            y: Math.floor(blocks[i].y),
            data: blocks[i].data,
            type: blocks[i].type,
        }
        data.push(currentData)
    }
    saveData[currentSaveFile].data = data;
    saveData[currentSaveFile].blocks = types;
    localStorage.setItem("saveData", JSON.stringify(saveData));
}

function loadCurrentState() {
    changeScene("play")
    let sidebar = Array.from(category("sidebar"))
    let data = saveData[currentSaveFile].data;
    types = saveData[currentSaveFile].blocks;
    sidebar[0].regenerate()
    if(data.length > 1) {
        for(let i=0; i < data.length; i++) {
            if(data[i].type == "segment") {
                add(new Segment(data[i].x, data[i].y, data[i].data))
            } else if(data[i].type == "LED") {
                add(new LED(data[i].x, data[i].y, data[i].data))
            } else {
                add(new defaultBlock(data[i].x, data[i].y, data[i].type, data[i].data))
            }
        }
    }
}

function changeScene(newScene) {
    sortedEntities = [];
    entities = new Set()
    entityCategories = new Map();
    
    if (html[screen] && html[screen].exit) {
        for (let element of html[screen].exit) {
            element.classList.add("hidden")
        }
    }

    if (html[newScene] && html[newScene].enter) {
        for (let element of html[newScene].enter) {
            element.classList.remove("hidden")
        }
    }

    if (html[newScene] && html[newScene].onenter) {    
        html[newScene].onenter()
    }
    if (html[screen] && html[screen].onexit) {
        html[screen].onexit()
    }
    previousScreen = screen
    screen = newScene
}

function openPopUp(name) {
    if (popUps[name] && popUps[name].enter) {
        for (let element of popUps[name].enter) {
            element.classList.remove("hidden")
        }
    }
    if (popUps[name] && popUps[name].entities) {    
        for(let i=0; i < popUps[name].entities.length; i++) {
            let entity = popUps[name].entities[i];
            add(entity);
            entity.layer = 2000;
        }
    }
    if (popUps[name] && popUps[name].onenter) {    
        popUps[name].onenter()
    }
}

function closePopUp(name) {
    if (popUps[name] && popUps[name].exit) {
        for (let element of popUps[name].exit) {
            element.classList.add("hidden")
        }
    }
    if (popUps[name] && popUps[name].entities) {    
        for(let entity of popUps[name].entities) {
            entity.remove()
        }
    }
}