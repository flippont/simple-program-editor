//document, canvas setup...
var canvas = document.getElementById('g');
var tileset = new Image();
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

var ctx = canvas.getContext("2d");
let entities = new Set()
let entityCategories = new Map();
let sortedEntities = [];
let entityPos = {}
let holding = -1;
let blocks = []
let toggleDrag = false;

let GAME_PAUSED;
let DEBUG = false; // Edit in console
canvasPrototype = CanvasRenderingContext2D.prototype;


const types = {
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
    "AND": {
        inputs: 2,
        outputs: 1,
        truthTable: generateTruthTable(2, (inputs) => [Number(inputs.every(v => v === 1))]),
        width: 70,
        height: 40,
        colour: "#834C01"
    },
    "NOT": {
        inputs: 1,
        outputs: 1,
        truthTable: generateTruthTable(1, (inputs) => [Number(inputs[0] === 0)]), // Inverse of the input
        width: 50,
        height: 40,
        colour: "#F44336"
    },
    "CUSTOM": {
        inputs: 2,
        outputs: 2,
        truthTable: generateTruthTable(2, (inputs) => [
            inputs[0] & inputs[1], // First output is AND
            inputs[0] | inputs[1]  // Second output is OR
        ]),
        width: 80,
        height: 40,
        colour: "#3E7C17"
    }
};

function generateTruthTable(numInputs, logicFn) {
    const table = [];
    const maxCombination = Math.pow(2, numInputs);
    for (let i = 0; i < maxCombination; i++) {
        // Generate binary input array
        const inputs = Array.from({ length: numInputs }, (_, index) => (i >> index) & 1).reverse();
        // Evaluate the logic function and ensure the result is an array
        const result = logicFn(inputs);
        if (!Array.isArray(result)) {
            throw new Error(`Logic function must return an array. Got: ${result}`);
        }
        table.push(result);
    }
    return table;
}
