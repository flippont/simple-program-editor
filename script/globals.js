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

let GAME_PAUSED;
canvasPrototype = CanvasRenderingContext2D.prototype;

let types = {
    "input": {
        "function": "this.currentValue",
        "togglable": true,
        "inputs": 0,
        "outputs": 1,
        "width": 30,
        "height": 40,
        "colour": "black"
    },
    "output": {
        "function": "this.A",
        "inputs": 1,
        "outputs": 0,
        "width": 30,
        "height": 40,
        "colour": "blue"
    },
    "not": {
        "function": "(this.A = !this.A)",
        "inputs": 1,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#834C01"
    },
    "and": {
        "function": "(this.A == 1 && this.B == 1)",
        "inputs": 2,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#3B0057"
    },
    "or": {
        "function": "(this.A == 1 || this.B == 1)",
        "inputs": 2,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#00541C"
    },
    "xor": {
        "function": "(this.A != this.B)",
        "inputs": 2,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#003966"
    },
    "nand": {
        "function": "(this.A == 0 || this.B == 0)",
        "inputs": 2,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#807A00"
    },
    "xnor": {
        "function": "(this.A == this.B)",
        "inputs": 2,
        "outputs": 1,
        "width": 70,
        "height": 40,
        "colour": "#44110A"
    }
}