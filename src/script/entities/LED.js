class LED extends Block {
    constructor(x, y, data) {
        super();
        this.x = x;
        this.y = y;
        this.type = "LED"
        this.data = {inputs: (data.inputs || [[-1]]), outputs: (data.outputs || [[]])};
        this.width = types["LED"].width;
        this.height = types["LED"].height;
        this.currentValue = [0];
        this.initialX = x;
        this.initialY = y;
        this.cycle = 0;
        this.states = ["#D82D32", "#22935B", "#2D5FAC"];
        this.triggered = false;
    }
    run() {
        super.run();
        if(DOWN[32] && this.hovered) {
            if(!this.triggered) {
                this.cycle++;
            }
            this.triggered = true;
        } else {
            this.triggered = false;
        }
        if(this.cycle >= this.states.length) {
            this.cycle = 0;
        }
    }
    draw() {
        super.draw();
        ctx.beginPath();
        ctx.fillStyle =  this.states[this.cycle];
        ctx.globalAlpha = (this.currentValue[0]) ? 1 : 0.5;
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill()
    }
}