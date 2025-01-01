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
let checkArray = []
let GAME_PAUSED;
let DEBUG = true;
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
    "AND": {
        inputs: 2,
        outputs: 1,
        logic: (inputs) => inputs.every(input => input === 1) ? 1 : 0,
        width: 70,
        height: 40,
        colour: "#834C01",
        preProgrammed: true
    },
    "NOT": {
        inputs: 1,
        outputs: 1,
        logic: (inputs) => inputs[0] === 1 ? 0 : 1,
        width: 70,
        height: 40,
        colour: "#F44336",
        preProgrammed: true
    }
};

function createNewBlock() {
    let name = nameInput.value.toUpperCase();
    console.log(name.trim().length, types[name])
    if(name.trim().length != 0 && types[name] == undefined) {
        let sidebar = Array.from(category("sidebar"));
        let gates = Array.from(category("blocks"));
        const inputBlocks = gates.filter(block => block.type === "input");    
        const outputBlocks = gates.filter(block => block.type === "output"); 
        let trueOutput = [];
        outputBlocks.map((output) => {
            trueOutput.push(gates.indexOf(output))
        })
        const encapsulatedLogic = generateEncapsulatedLogic(gates, trueOutput);
        let object = {
            inputs: inputBlocks.length,
            outputs: outputBlocks.length,
            logic: (inputs) => encapsulatedLogic(inputs),
            width: ctx.measureText(name).width + 40,
            height: 40,
            colour: colourValue
        }
        types[name] = object;
        sidebar[0].regenerate();
        colourValue = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        colourInput.value = colourValue
    }
}

function generateEncapsulatedLogic(gates, outputGateIds) {
    // Helper function to recursively build the logic
    function buildLogic(gate) {
        if (gate.type === "input") {
            // Return a function that retrieves the value of the input dynamically based on its index
            return (inputs) => inputs[gate.inputIndex];
        }

        if (!types[gate.type].logic) throw new Error(`Gate ${gate.id} is missing logic.`);
        
        // Recursively generate logic for all inputs of this gate
        const inputFunctions = gate.data.inputs.map(inputId => {
            const inputGate = gates[inputId[0]];
            return buildLogic(inputGate);
        });

        // Return a function that applies this gate's logic to its inputs
        return (inputs) => types[gate.type].logic(inputFunctions.map(fn => fn(inputs)));
    }

    // Build logic functions for all specified output gates
    const outputLogics = outputGateIds.map(outputGateId => {
        const outputGate = gates[outputGateId];
        if (!outputGate) throw new Error(`Gate with ID ${outputGateId} does not exist.`);

        if (!types[outputGate.type].logic) {
            // For an "output" gate, assume it just returns its single input
            const inputFunctions = outputGate.data.inputs.map(inputId => {
                const inputGate = gates[inputId[0]];
                return buildLogic(inputGate);
            });
            return (inputs) => inputFunctions[0](inputs); // Return the single input's logic
        } else {
            return buildLogic(outputGate);
        }
    });

    // Return a function that evaluates all specified output gates
    return (inputsArray) => outputLogics.map(logicFn => logicFn(inputsArray));
}
