class Button extends Entity {
    constructor(x, y, width, height, type) {
        super()
        this.categories = ["button"]
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spawned = false;
        this.hovered = false;
    }
    get z() {
        return 11;
    }
    run() {
        this.hovered = false;
        if(MOUSE_POSITION.x > this.x - this.width / 2 && MOUSE_POSITION.x < this.x + this.width / 2) {
            if(MOUSE_POSITION.y > (this.y - this.height / 2) && MOUSE_POSITION.y < (this.y + this.height / 2)) {
                this.hovered = true;
                if(MOUSE_DOWN && !this.spawned) {
                    let data = {input: ["", ""]}
                    add(new Block(MOUSE_POSITION.x, MOUSE_POSITION.y, this.type, data))
                    this.spawned = true;
                }
            }
        }
        if(!MOUSE_DOWN) {
            this.spawned = false;
        }
    }
    draw() {
        let display = this.type.toUpperCase();
        if(this.type == "input") {
            display = 1;
        }
        if(this.type == "output") {
            display = 0;
        }
        if(this.hovered) {
            document.body.style.cursor = "pointer"
            ctx.globalAlpha = 0.4;
        }
        ctx.fillStyle = types[this.type].colour;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = "bold 15px Arial"
        ctx.fillStyle = "white"
        ctx.fillText(display, this.x, this.y);
    }
}