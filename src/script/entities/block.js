class Block extends Entity {
    constructor(x, y, type, data) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.categories = ["blocks"]
        if(this.type == "input") {
            this.categories.push("input")
        }
        this.data = {inputs: (data.inputs || []), outputs: (data.outputs || [])};
        this.currentValue = [];
        if (!data.inputs) {
            for (let i = 0; i < types[this.type].inputs; i++) {
                this.data.inputs.push([-1]);
            }
        }
        if (!data.outputs) {
            for (let i = 0; i < types[this.type].outputs; i++) {
                this.data.outputs.push([]);
                this.currentValue.push(1)
            }
        }

        this.width = types[this.type].width;
        this.height = types[this.type].height;
        this.index = 0;
        this.toggled = false;
        this.initialX = x;
        this.initialY = y;
        this.hoveredEnd = "";
        this.dots = [];
        this.inputIndex = "";
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
        let evalInputs = Array.from(category("input"));
        if(this.type == "input") {
            this.inputIndex = evalInputs.indexOf(this)
        }
        if(!MOUSE_DOWN && this.x < 200) {
            this.destroy()
        }
        // Gather inputs
        const inputs = [];
        for (let i = 0; i < this.data.inputs.length; i++) {
            inputs.push((this.data.inputs[i] && this.data.inputs[i][0] != -1) ? evaluate[this.data.inputs[i][0]].currentValue[this.data.inputs[i][1]] : 0)
        }
        // Convert inputs to index
        if (this.type === "output") {
            this.currentValue[0] = inputs[0]; // Directly use the first input's value
        } else if(this.type === "input") {
            if (DOWN[32] && !this.toggled && this.hovered) {
                this.currentValue[0] = (this.currentValue[0] === 0) ? 1 : 0;
                this.toggled = true;
            }
            if (!DOWN[32]) {
                this.toggled = false;
            }
        } else {
            // accidentally did it wrong. It works, and this is better for performance so I'm not going to fix it
            // All it means is that the pre-programmed ones are a tad bit slower
            // Ah well the max is 2 inputs with the AND gate so it should be i
            if(types[this.type].preProgrammed) {
                for (let i = 0; i < this.currentValue.length; i++) {
                    this.currentValue[i] = types[this.type].logic(inputs) ?? 0;
                }
            } else {
                this.currentValue = this.extractTrueValues(types[this.type].logic(inputs)) ?? 0;
            }
        }
    
        this.hovered = false
        this.index = evaluate.indexOf(this)

        this.mouseOver()

        // Mouse down check
        if(MOUSE_DOWN) {
            if(holding != (this.index + 1)) return
            this.layer = 999;
            this.x = MOUSE_POSITION.x;
            this.y = MOUSE_POSITION.y;
        } else {
            this.layer = 20;
            holding = -1;
        }
    }

    mouseOver() {
        let isHovered = false;
        let cursors = Array.from(category("cursor"));
        
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
                    if(MOUSE_DOWN && holding == -1 && !isHovered) {
                        holding = this.index + 1;
                    }
                }
            }
        }
        if(isHovered) {
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
        let display = this.type.toUpperCase();
        if(this.type == "input" || this.type == "output") {
            display = this.currentValue;
        }
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

        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = "bold 15px Arial"
        ctx.fillStyle = "white"
        ctx.fillText(display, this.x, this.y);
        ctx.closePath()

        let evaluate = Array.from(category("blocks"));
        let isolateInput = this.data.inputs;

        for(let i=0; i<isolateInput.length; i++) {
            ctx.strokeStyle = "black"
            if(isolateInput[i] && isolateInput[i] != -1) {
                ctx.beginPath()
                let destination = evaluate[isolateInput[i][0]];
                let outputIndex = isolateInput[i][1]
                ctx.moveTo(this.x - (this.width / 2) + (i + 1) * (this.width / (types[this.type].inputs + 1)), this.y - (this.height / 2));
                ctx.lineTo(destination.x - (destination.width / 2) + (outputIndex + 1) * (destination.width / (types[destination.type].outputs + 1)), destination.y + destination.height / 2)
                ctx.stroke()
                ctx.closePath()
            }
        }
    }
}
