class Cursor extends Entity {
    constructor(target, end, type) {
        super()
        this.categories = ["cursor"]
        this.end = "";
        for(let i=0; i<end.length; i++) {
            if(end[i] != "") {
                this.end = end[i]
                this.originIndex = i;
            }
        }
        this.type = type
        this.index = target.index;
        this.target = target;
    }
    get z() {
        return 9999
    }
    run() {
        this.x = MOUSE_POSITION.x;
        this.y = MOUSE_POSITION.y;
        if(!MOUSE_DOWN) {
            this.remove()
        }
    }
    draw() {
        ctx.beginPath();
        let targetX = this.end.x
        let targetY = this.end.y
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