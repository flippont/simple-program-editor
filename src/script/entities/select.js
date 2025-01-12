class Selector extends Entity {
    constructor() {
        super()
        this.categories = ["selector"];
        this.active = false;
        this.lastMousePosition = {x: 0, y: 0}
    }
    get z() {
        return 9999
    }
    run() {
        let blocks = Array.from(category("blocks"))
        let cursors = Array.from(category("cursor"));
        let popUp = Array.from(category("popup"));
        if(popUp[0]) return

        if(MOUSE_DOWN && holding == -1 && DOWN_MOUSE_POSITION.x > 220 && cursors.length == 0) {
            this.x = DOWN_MOUSE_POSITION.x
            this.width = MOUSE_POSITION.x - DOWN_MOUSE_POSITION.x
            this.y = DOWN_MOUSE_POSITION.y
            this.height = MOUSE_POSITION.y - DOWN_MOUSE_POSITION.y
            this.active = true;
            selectors = [];
            for(let i=0; i<blocks.length; i++) {
                if(blocks[i].x > this.x && blocks[i].x < this.x + this.width
                    && blocks[i].y > this.y && blocks[i].y < this.y + this.height) {
                    if(selectors.includes(blocks[i])) return
                    selectors.push(blocks[i]);
                } else if(blocks[i].x > this.x && blocks[i].x < this.x + this.width
                    && blocks[i].y < this.y && blocks[i].y > this.y + this.height) { 
                    if(selectors.includes(blocks[i])) return
                    selectors.push(blocks[i]);
                } else if(blocks[i].x < this.x && blocks[i].x > this.x + this.width
                    && blocks[i].y > this.y && blocks[i].y < this.y + this.height) { 
                    if(selectors.includes(blocks[i])) return
                    selectors.push(blocks[i]);
                } else if(blocks[i].x < this.x && blocks[i].x > this.x + this.width
                    && blocks[i].y < this.y && blocks[i].y > this.y + this.height) { 
                    if(selectors.includes(blocks[i])) return
                    selectors.push(blocks[i]);
                } 
            }
        } else {
            this.active = false;
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        if(DOWN[46]) {
            for(let i=0; i<selectors.length; i++) {
                selectors[i].layer = 0;
                selectors[i].x = 100;
            }
        }
        if(this.width + this.x <= 220) {
            this.width = 220 - this.x
        }

        // Initialize lastMousePosition if it doesn't exist
        if (!this.lastMousePosition) {
            this.lastMousePosition = { x: MOUSE_POSITION.x, y: MOUSE_POSITION.y };
        }
        let deltaX = MOUSE_POSITION.x - this.lastMousePosition.x;
        let deltaY = MOUSE_POSITION.y - this.lastMousePosition.y;
        if(selectors.length > 1 && !this.active && MOUSE_DOWN) {
            for (let i = 0; i < selectors.length; i++) {
                selectors[i].x += deltaX;
                selectors[i].y += deltaY;
            }
        }
        this.lastMousePosition.x = MOUSE_POSITION.x;
        this.lastMousePosition.y = MOUSE_POSITION.y;
    }
    draw() {
        ctx.strokeStyle = "#FFF"
        ctx.fillStyle = "#FFF"
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 2;
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}