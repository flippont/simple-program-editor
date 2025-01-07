//document, canvas setup...
var canvas = document.getElementById('g');
var tileset = new Image();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let CANVAS_WIDTH = canvas.width;
let CANVAS_HEIGHT = canvas.height;

var ctx = canvas.getContext("2d");
let entities = new Set()
let entityCategories = new Map();
let sortedEntities = [];
let entityPos = {}
let holding = -1;
let blocks = [];
let toggleDrag = false;
let checkArray = [];
let selectors = [];
let GAME_PAUSED;
let DEBUG = false;
let version = 0.5;
let scrollPos = 0;
let totalHeight = 0;

let colourValue = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
colourInput.value = colourValue
canvasPrototype = CanvasRenderingContext2D.prototype;

let types = {
    "input": {
        inputs: 0,
        outputs: 1,
        width: 30,
        height: 40,
        colour: "black"
    },
    "output": {
        inputs: 1,
        outputs: 0,
        width: 30,
        height: 40,
        colour: "blue"
    },
    "LED": {
        inputs: 1,
        outputs: 1,
        width: 30,
        height: 40,
        colour: "black"
    },
    "segment": {
        inputs: 8,
        outputs: 0,
        width: 120,
        height: 80,
        colour: "black"
    },
    "AND": {
        inputs: 2,
        outputs: 1,
        table: {
            i0: [0, 1, 0, 1],
            i1: [0, 0, 1, 1],
            o0: [0, 0, 0, 1],
        },
        width: 70,
        height: 40,
        colour: "#834C01",
        preProgrammed: true
    },
    "NOT": {
        inputs: 1,
        outputs: 1,
        table: {
            i0: [0, 1],
            o0: [1, 0],
        },
        width: 70,
        height: 40,
        colour: "#F44336",
        preProgrammed: true
    }
};

function createNewBlock() {
    let name = nameInput.value.toUpperCase();
    let gates = Array.from(category("blocks"));
    if(name.trim().length != 0 && types[name] == undefined && gates.filter((gate) => gate.type == "input").length > 0) {
        generateTable(name);
        colourValue = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        colourInput.value = colourValue = colourValue;
        colourPickerWrapper.style.backgroundColor = colourValue;
    }
}

function generateTable(name) {
    let gates = Array.from(category("blocks"));
    let sidebar = Array.from(category("sidebar"));
    const inputBlocks = [];    
    const outputBlocks = []; 
    let table = {};
    colourValue = colourInput.value;
    for(let i=0; i<gates.length; i++) {
        if(gates[i].type == "input") {
            inputBlocks.push(gates[i])
            table[`i${inputBlocks.length-1}`] = [];
        }
        if(gates[i].type == "output") {
            outputBlocks.push(gates[i]);
            table[`o${outputBlocks.length-1}`] = [];
        }
    }
    for(let i=0; i< 2**inputBlocks.length; i++) {
        let bin = i.toString(2);
        while (bin.length < inputBlocks.length) {
            bin = `0${bin}`;
        }
        for (let j = 0; j < bin.length; j++) {
            console.log(parseInt(bin[bin.length-j-1]))
            inputBlocks[j].currentValue[0] = parseInt(bin[bin.length-j-1]);
            inputBlocks[j].changeStateBelow();
            table[`i${j}`].push(parseInt(bin[bin.length-j-1]));
        }
        for (let j = 0; j < outputBlocks.length; j++) {
            table[`o${j}`].push(outputBlocks[j].currentValue[0]);
        }
    }
    let object = {
        inputs: inputBlocks.length,
        outputs: outputBlocks.length,
        table: table,
        width: ctx.measureText(name).width + 40,
        height: 40,
        colour: colourValue
    }
    types[name] = object;
    sidebar[0].regenerate();
    closePopUp()
}
