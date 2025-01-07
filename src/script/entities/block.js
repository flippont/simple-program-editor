class Block extends Entity {
    constructor() {
        super();
        this.categories = ["blocks"]
        this.index = 0;
        this.toggled = false;
        this.type = "";
        this.currentValue = [];
        this.data = {inputs: [], outputs: []};
        this.hoveredEnd = "";
        this.dots = [];
        this.width = this.height = 0;
        this.initialX = this.initialY = 0;
        this.offSet = {x:0, y: 0};
    }
    extractTrueValues(array) {
        function resolveElement(element) {
            if (Array.isArray(element)) {
                // Return the first element as the 'true value' recursively
                return resolveElement(element[0]);
            }
            return element;
        }
    
        // Process the input array to extract true values for each element
        return array.map(resolveElement);
    }
    
    run() {
        let evaluate = Array.from(category("blocks"));

        if(!MOUSE_DOWN && this.x < 220) {
            this.destroy()
        }
        // Convert inputs to index
        if(this.type === "input") {
            if (DOWN[32] && !this.toggled && this.hovered) {
                this.currentValue[0] = (this.currentValue[0] === 0) ? 1 : 0;
                this.toggled = true;
            }
            if (!DOWN[32]) {
                this.toggled = false;
            }
            this.changeStateBelow()
        }
    
        this.hovered = false
        this.index = evaluate.indexOf(this)

        this.mouseOver()
        this.checkInputValid()
        // Mouse down check
        if(MOUSE_DOWN) {
            if(holding != (this.index + 1)) return
            if(DOWN[17] && !selectors.includes(this)) {
                selectors.push(this);
            } else {
                if(!selectors.includes(this)) {
                    selectors = [];
                    selectors.push(this);
                }
            }
            if(this.layer == 20) {
                this.offSet = {x: DOWN_MOUSE_POSITION.x - this.x, y: DOWN_MOUSE_POSITION.y - this.y}
            }
            this.layer = 999;
            if(selectors.length == 1) {
                this.x = MOUSE_POSITION.x - this.offSet.x;
                this.y = MOUSE_POSITION.y - this.offSet.y;
            }
        } else {
            this.layer = 20;
            holding = -1;
        }
    }

    checkInputValid() {
        let evaluate = Array.from(category("blocks"));

        for(let i=0; i<this.data.inputs.length; i++) {
            if(evaluate[this.data.inputs[i][0]] == undefined) {
                this.data.inputs[i] = [-1]
            }
        }
        for(let i=0; i<this.data.outputs.length; i++) {
            if(evaluate[this.data.outputs[i][0]] == undefined) {
                this.data.outputs[i] = [];
                this.currentValue[i] = 0;
            }
        }
    }

    changeStateBelow() {
        let evaluate = Array.from(category("blocks"));
        for(let i=0; i<this.data.outputs.length; i++) {
            for(let j=0; j<this.data.outputs[i].length; j++) {
                let subject = evaluate[this.data.outputs[i][j]];
                if(subject == undefined) return
                if(subject.type != "output" && subject.type != "LED") {
                    let newInputs = []
                    // Gather inputs
                    for (let k = 0; k < subject.data.inputs.length; k++) {
                        newInputs.push((subject.data.inputs[k] && subject.data.inputs[k][0] != -1) ? evaluate[subject.data.inputs[k][0]].currentValue[subject.data.inputs[k][1]] : 0)
                        if(subject.type == "segment") {
                            subject.currentValue[k] = newInputs[k]
                        }
                    }
                    if(subject.type != "segment") {
                        subject.changeState(newInputs)
                    } 
                } else {
                    subject.currentValue = this.currentValue;
                }
                if(subject.data.outputs) {
                    subject.changeStateBelow()
                }
            }
        }
    }

    changeState(inputs) {
        let table = types[this.type].table;
        // Determine the number of inputs and outputs from the table
        const inputKeys = Object.keys(table).filter(key => key.startsWith('i'));
        const outputKeys = Object.keys(table).filter(key => key.startsWith('o'));

        // Iterate through the rows of the table
        for (let rowIndex = 0; rowIndex < table[inputKeys[0]].length; rowIndex++) {
            let match = true;
            for (let i = 0; i < inputKeys.length; i++) {
                if (table[inputKeys[i]][rowIndex] !== inputs[i]) {
                    match = false;
                    break;
                }
            }
            // If inputs match, return the corresponding output(s)
            if (match) {
                this.currentValue = outputKeys.map(outputKey => table[outputKey][rowIndex]);
            }
        }
    }

    mouseOver() {
        let isHovered = false;
        let cursors = Array.from(category("cursor"));
        let selector = Array.from(category("selector"));
        
        for(let i=0; i<this.hoveredEnd.length; i++) {
            if(this.hoveredEnd[i]) {
                isHovered = true;
            }
        }

        // TODO: add global collision function
        if(MOUSE_POSITION.x > this.x - this.width / 2 && MOUSE_POSITION.x < this.x + this.width / 2) {
            if(MOUSE_POSITION.y > (this.y - this.height / 2) && MOUSE_POSITION.y < (this.y + this.height / 2)) {
                this.hovered = true;
                if(cursors.length === 0) {
                    if(MOUSE_DOWN && holding == -1 && !isHovered && !selector[0].active) {
                        holding = this.index + 1;
                    }
                }
            }
        }
        if(isHovered && !selector[0].active) {
            this.handleCursor()
        }
    }

    handleCursor() {
        // Cursor Holding
        let cursors = Array.from(category("cursor"));
        let evaluate = Array.from(category("blocks"));
        if(cursors.length === 0 && MOUSE_DOWN && holding === -1) {
            let type = "input";
            for(let i=0; i<this.hoveredEnd.length; i++) {
                if(this.hoveredEnd[i]) {
                    if(i >= types[this.type].inputs) {
                        type = "output";
                    }
                }
            } 
            add(new Cursor(this, this.hoveredEnd, type))
        }

        // Cursor Release
        if(cursors.length > 0 && !MOUSE_DOWN) {
            let origin = cursors[0].type;
            let destination = "input";
            let selected = cursors[0].index
            for(let i=0; i<(this.hoveredEnd.length); i++) {
                if(this.hoveredEnd[i] != "") {
                    if(i >= types[this.type].inputs) {
                        destination = "output"
                    }
                    if(origin == "output" && destination == "input") {
                        // Check if node is pre-occupied
                        if(this.data.inputs[i] && this.data.inputs[i][0] != -1) {
                            let subject = evaluate[this.data.inputs[i][0]]
                            let outputNode = this.data.inputs[i][1];
                            if(subject.data.outputs[outputNode].includes(this.index)) {
                                let subIndex = subject.data.outputs[outputNode].indexOf(this.index);
                                subject.data.outputs[outputNode].splice(subIndex, 1)
                            }
                        }
                        let indexedArray = evaluate[selected].data.outputs[cursors[0].originIndex - evaluate[selected].data.inputs.length];
                        let outputCount = indexedArray.filter(x => x==this.index).length
                        if(outputCount < types[this.type].inputs) {
                            indexedArray.push(this.index);    
                        }
                        this.data.inputs[i] = [selected, cursors[0].originIndex - types[evaluate[selected].type].inputs];
                        break;
                    }
                    if(origin == "input" && destination == "output") {
                        // Check doubles
                        if(evaluate[selected].data.inputs[cursors[0].originIndex] && evaluate[selected].data.inputs[cursors[0].originIndex][0] != -1) {
                            let outputNode = evaluate[selected].data.inputs[cursors[0].originIndex][1];
                            if(this.data.outputs[outputNode].includes(evaluate[selected].index)) {
                                let subIndex = this.data.outputs[outputNode].indexOf(evaluate[selected].index);
                                this.data.outputs[outputNode].splice(subIndex, 1)
                            }
                        }

                        let indexedArray = this.data.outputs[(i - this.data.inputs.length)];
                        let outputCount = indexedArray.filter(x => x==evaluate[selected].index).length
                        if(outputCount < types[evaluate[selected].type].inputs) {
                            indexedArray.push(evaluate[selected].index);
                        }
                        evaluate[selected].data.inputs[cursors[0].originIndex] = [this.index, i - types[this.type].inputs];
                        break;
                    }
                }
            }
        }
    }

    destroy() {
        let evaluate = Array.from(category("blocks"));

        // Check above
        for(let i=0; i<this.data.outputs.length; i++) {
            for(let j=0; j<this.data.outputs[i].length; j++) {
                let evalElement = evaluate[this.data.outputs[i][j]];
                let inputIndex = evalElement.data.inputs.map((x, index) => {
                    if(x[0] == this.index) {
                        return index;
                    }
                })
                for(let indexItem of inputIndex) {
                    if(indexItem > -1) {
                        evalElement.data.inputs[indexItem] = [-1];
                    }
                }
            }
        }

        // Check below
        for(let k=0; k<this.data.inputs.length; k++) {
            if(this.data.inputs[k] && this.data.inputs[k][0] != -1) {
                let outputs = evaluate[this.data.inputs[k][0]].data.outputs;
                let outputIndex = this.data.inputs[k][1]
                let secondLevel = outputs[outputIndex].indexOf(this.index);
                outputs[outputIndex].splice(secondLevel, 1)
            }
        }
        if(selectors.includes(this)) {
            let index = selectors.indexOf(this);
            selectors.splice(index, 1);
        }

        this.remove()

        // Final Check on all
        this.reduceItems(this.index)
    }

    reduceItems(index) {
        let evaluate = Array.from(category("blocks"));
        for(let i=0; i < evaluate.length; i++) {
            // check inputs
            for(let j=0; j < evaluate[i].data.inputs.length; j++) {
                if(evaluate[i].data.inputs[j] && evaluate[i].data.inputs[j][0] > index) {
                    evaluate[i].data.inputs[j][0] -= 1;
                }
            }

            // check outputs
            for(let k=0; k < evaluate[i].data.outputs.length; k++) {
                for(let l=0; l < evaluate[i].data.outputs[k].length; l++) {
                    if(evaluate[i].data.outputs[k][l] && evaluate[i].data.outputs[k][l] > index) {
                        evaluate[i].data.outputs[k][l] -= 1;
                    }
                }
            }
        }
    }

    generateDots() {
        let inputs = this.data.inputs.length;
        let outputs = this.data.outputs.length;
        this.hoveredEnd = [];
        this.dots = [];
        
        for(let i=0; i<inputs; i++) {
            let interval = this.width / (inputs + 1);
            let dot = {"x": this.x - this.width / 2 + ((i + 1) * interval), "y": this.y - this.height / 2, "radius": 7};
            this.dots.push(dot)
        }
        for(let i=0; i<outputs; i++) {
            let interval = this.width / (outputs + 1);
            let dot = {"x": this.x - this.width / 2 + ((i + 1) * interval), "y": this.y + this.height / 2, "radius": 7};
            this.dots.push(dot)
        }
    }

    draw() {
        ctx.lineWidth = 2;
        if(selectors.includes(this)) {
            ctx.fillStyle = "#FFF";
            ctx.globalAlpha = 0.2;
            ctx.fillRect(this.x - this.width / 2 - 15, this.y - this.height / 2 - 15, this.width + 30, this.height + 30)
        }
        ctx.globalAlpha = 1;
        if(DEBUG) {
            if(this.hovered || holding == (this.index + 1)) {
                debug.style.display = "block"
                xPos.innerHTML = Math.floor(this.x)
                yPos.innerHTML = Math.floor(this.y)
                inputDiv.innerHTML = JSON.stringify(this.data.inputs)
                outputDiv.innerHTML = JSON.stringify(this.data.outputs)
                valueDiv.innerHTML = JSON.stringify(this.currentValue);
                debug.style.top = MOUSE_POSITION.y + "px"
                debug.style.left = MOUSE_POSITION.x + "px"
            }
        }

        ctx.beginPath()
        ctx.fillStyle = types[this.type].colour
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fill()
        if(DEBUG) {
            ctx.stroke()
        }

        this.generateDots()
        for(let i=0; i<this.dots.length; i++) {
            let Xdif = MOUSE_POSITION.x - this.dots[i].x;
            let Ydif = MOUSE_POSITION.y - this.dots[i].y;
            if(Math.sqrt(Math.pow(Xdif, 2) + Math.pow(Ydif, 2)) <= this.dots[i].radius) {
                this.hoveredEnd.push(this.dots[i]);
            } else {
                this.hoveredEnd.push("")
            }
            ctx.beginPath()
            ctx.fillStyle = (this.hoveredEnd[i]) ? "white" : "black";
            ctx.arc(this.dots[i].x, this.dots[i].y, this.dots[i].radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
