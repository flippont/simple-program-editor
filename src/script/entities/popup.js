class popUp extends Entity {
    constructor(offSetX, offSetY, w, h, colour, type) {
        super();
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.width = w;
        this.height = h;
        this.colour = colour;
        this.type = type;
        this.hovered = false;
        this.categories = ["popup"]
    }
    get z() {
        return 1000;
    }
    run() {

    }
    draw() {
        ctx.fillStyle = this.colour;
        ctx.fillRect(CANVAS_WIDTH/2 - this.width/2 + this.offSetX, CANVAS_HEIGHT/2 - this.height/2 + this.offSetY, this.width, this.height)
    }
}