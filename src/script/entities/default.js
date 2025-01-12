class defaultBlock extends Block {
    constructor(x, y, type, data) {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.data = {inputs: (data.inputs || []), outputs: (data.outputs || [])};
        if (!data.inputs) {
            for (let i = 0; i < types[this.type].inputs; i++) {
                this.data.inputs.push([-1]);
            }
        }
        if (!data.outputs) {
            for (let i = 0; i < types[this.type].outputs; i++) {
                this.data.outputs.push([]);
                if(this.type != "input") {
                    this.currentValue.push(0)
                }
            }
        }
        if(this.type == "input") {
            this.currentValue = [1]
        }
        if(this.type == "output") {
            this.currentValue = [0]
        }
        this.width = types[this.type].width;
        this.height = types[this.type].height;
        this.initialX = x;
        this.initialY = y;
    }
    run() {
        super.run();
    }
    draw() {
        super.draw();
        let display = this.type.toUpperCase();
        if(this.type == "input" || this.type == "output") {
            display = this.currentValue;
        }
        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = "bold 15px Arial"
        ctx.fillStyle = "white"
        ctx.fillText(display, this.x, this.y);
        ctx.closePath()
    }
}