class Cursor extends Entity {
    constructor(target) {
        super()
        this.categories = ["cursor"]
        let evaluate = Array.from(category("blocks"));
        this.index = target;
        this.target = evaluate[target];
    }
    get z() {
        return 1
    }
    run() {
        this.x = MOUSE_POSITION.x;
        this.y = MOUSE_POSITION.y;
        if(!MOUSE_RIGHT_DOWN) {
            this.remove()
        }
    }
    draw() {
        ctx.beginPath();
        let targetX = this.target.x
        let targetY = this.target.y + this.target.height / 2
        ctx.fillStyle = "black"
        ctx.lineWidth = 2
        ctx.moveTo(targetX, targetY)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
        ctx.closePath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill()
    }
}