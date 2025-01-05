class Segment extends Block {
    constructor(x, y, data) {
        super();
        this.x = x;
        this.y = y;
        this.type = "segment"
        this.data = {inputs: (data.inputs || []), outputs: (data.outputs || [])};
        if (!data.inputs) {
            for (let i = 0; i < types["segment"].inputs; i++) {
                this.data.inputs.push([-1]);
                this.currentValue.push(0)
            }
        }
        this.width = types["segment"].width;
        this.height = types["segment"].height;
        this.initialX = x;
        this.initialY = y;
    }
    run() {
        super.run();
    }
    drawDisplay(x, y, width, height, rotation, on) {
        ctx.beginPath();
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.moveTo(width/2, - height / 2);
        ctx.lineTo(- width/2, - height / 2);
        ctx.lineTo(- width/2 - height / 2, 0);
        ctx.lineTo(- width/2, height / 2);
        ctx.lineTo(width/2, height / 2);
        ctx.lineTo(width/2 + height / 2, 0);
        ctx.lineTo(width/2, - height / 2);
        ctx.closePath();
        ctx.rotate(-rotation)
        ctx.translate(-x, -y)
        ctx.fillStyle = (on) ? "#D82D32" : "#242428";
        ctx.fill()
    }
    draw() {
        super.draw();
        this.drawDisplay(this.x - 21, this.y, 7, 7, 0, this.currentValue[7]) // DP

        this.drawDisplay(this.x, this.y, 14, 7, 0, this.currentValue[6]) // G
        this.drawDisplay(this.x - 12, this.y + 12, 14, 7, Math.PI / 2, this.currentValue[4]) // E
        this.drawDisplay(this.x, this.y + 24, 14, 7, 0, this.currentValue[3]) // D
        this.drawDisplay(this.x + 12, this.y + 12, 14, 7, Math.PI / 2, this.currentValue[2]) // C
        this.drawDisplay(this.x - 12, this.y - 12, 14, 7, Math.PI / 2, this.currentValue[5]) // F
        this.drawDisplay(this.x, this.y - 24, 14, 7, 0, this.currentValue[0]) // A
        this.drawDisplay(this.x + 12, this.y - 12, 14, 7, Math.PI / 2, this.currentValue[1]) // B
    }
}