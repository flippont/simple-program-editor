class Button extends Entity {
    constructor(x, y, width, height, text, colour = "#FFF", border = false, logic = "") {
        super()
        this.categories = ["button"]
        this.x = this.defX = x;
        this.y = this.defY = y;
        this.width = width;
        this.function = logic;
        this.height = height;
        this.colour = colour;
        this.border = border;
        this.text = text;
        this.triggered = false;
        this.hovered = false;
    }
    get z() {
        return 11;
    }
    run() {
        this.hovered = false;
        if(holding != -1) return false
        if(typeof this.defX == "string") {
            this.x = eval(this.defX)
        }
        if(typeof this.defY == "string") {
            this.y = eval(this.defY)
        }
        if(MOUSE_POSITION.x > this.x - this.width / 2 && MOUSE_POSITION.x < this.x + this.width / 2) {
            if(MOUSE_POSITION.y > this.y && MOUSE_POSITION.y < (this.y + this.height)) {
                this.hovered = true;
                if(MOUSE_DOWN && !this.triggered) {
                    this.function();
                    selectors = [];
                    this.triggered = true;
                }
            }
        }
        if(!MOUSE_DOWN) {
            this.triggered = false;
        }
    }
    draw() {
        if(this.hovered) {
            document.body.style.cursor = "pointer"
            ctx.globalAlpha = 0.4;
        }
        ctx.fillStyle = this.colour;
        ctx.strokeStyle = this.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(this.x - this.width/2, this.y, this.width, this.height)
        ctx.fill();
        if(this.border) {
            ctx.stroke();
        }
        ctx.closePath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = "bold 15px Arial"
        ctx.fillStyle = "white"
        ctx.fillText(this.text, this.x, this.y + this.height / 2);
    }
}