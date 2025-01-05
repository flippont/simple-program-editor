class LED extends Block {
    constructor(x, y, data) {
        super();
        this.x = x;
        this.y = y;
        this.type = "LED"
        this.data = {inputs: (data.inputs || [0]), outputs: (data.outputs || [0])};
        this.width = types["LED"].width;
        this.height = types["LED"].height;
        this.initialX = x;
        this.initialY = y;
        this.cycle = 0;
        this.states = ["#D82D32", "#22935B", "#2D5FAC"];
        this.triggered = false;
    }
    run() {
        if(DOWN[32]) {
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
        super.run();
    }
    draw() {
        super.draw();
        ctx.beginPath();
        ctx.fillStyle = (this.currentValue[0]) ? this.states[this.cycle] : "#242428";
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill()
    }
}