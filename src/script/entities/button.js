class Button extends Entity {
    constructor(x, y, width, height, text, colour = "#FFF", border = false, logic = "", disabled) {
        super()
        this.categories = ["button"]
        this.x = this.defX = x;
        this.y = this.defY = y;
        if(this.x == 100) {
            this.categories.push("SideButtons")
        }
        this.width = width;
        this.function = logic;
        this.height = height;
        this.colour = colour;
        this.border = border;
        this.text = text;
        this.triggered = false;
        this.hovered = false;
        this.index = 0;
        this.disabled = disabled || (() => false);
        this.layer = 11;
    }
    run() {
        let disabled = this.disabled()
        this.hovered = false;
        let select = Array.from(category("selector"));
        let buttons = Array.from(category("button"));
        let popUp = Array.from(category("popup"));

        this.index = buttons.indexOf(this);
        if(holding != -1) return false
        if(typeof this.defX == "string") {
            this.x = eval(this.defX)
        }
        if(typeof this.defY == "string") {
            this.y = eval(this.defY)
        }
        if(MOUSE_POSITION.x > this.x - this.width / 2 && MOUSE_POSITION.x < this.x + this.width / 2) {
            if(MOUSE_POSITION.y > this.y && MOUSE_POSITION.y < (this.y + this.height)) {
                if(!popUp[0] || popUps[popUp[0].type].entities.includes(this)) {
                    if(select[0] && !select[0].active || !select[0]) {
                        this.hovered = true;                    
                    }
                }
            }
        }
        if(MOUSE_DOWN && !this.triggered && this.hovered && !disabled) {
            if(clickedButton != -1) return
            clickedButton = this.index;
            this.function();
            selectors = [];
            this.triggered = true;
        } else {
            if(!MOUSE_DOWN){ 
                this.triggered = false;
                clickedButton = -1;
            }
        }
    }
    draw() {
        let disabled = this.disabled()
        if(this.hovered && !disabled) {
            document.body.style.cursor = "pointer"
            ctx.globalAlpha = 0.8;
        }
        if(disabled) {
            ctx.globalAlpha = 0.4;
        }
        ctx.fillStyle = (this.colour == "value") ? colourValue: this.colour;
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