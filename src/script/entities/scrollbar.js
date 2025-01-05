class scrollBar extends Entity {
    constructor(x, y, width, height) {
        super()
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hovered = false;
        this.offSet = 0;
        this.checked = false;
        this.show = false;
    }
    get z() {
        return 20
    }
    run() {
        this.hovered = false;
        if(MOUSE_POSITION.x > this.x && MOUSE_POSITION.x < this.x + this.width) {
            if(MOUSE_POSITION.y > this.y && MOUSE_POSITION.y < (this.y + this.height)) {
                if(holding == -1) {
                    if(!this.show) return
                    this.hovered = true;
                    document.body.style.cursor = "grab"
                }
            }
        }
        if(this.hovered && MOUSE_DOWN || this.checked && MOUSE_DOWN) {
            if(!this.show) return
            if(!this.checked) {
                this.offSet = DOWN_MOUSE_POSITION.y - this.y
                this.checked = true;
            }
            if(this.y >= 0 && this.y <= CANVAS_HEIGHT - this.height) {
                this.y = MOUSE_POSITION.y - this.offSet
            }
            document.body.style.cursor = "grabbing"
            scrollPos = this.y
        } else {
            this.checked = false;
        }
        if(MOUSE_POSITION.x < 220) {
            this.y += MOUSE_SCROLL
        }
        MOUSE_SCROLL = 0;
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height))
        let realHeight = totalHeight + types[Object.keys(types)[Object.keys(types).length - 1]].height + 20 // padding
        let scrollableArea = (realHeight > CANVAS_HEIGHT) ? (realHeight - CANVAS_HEIGHT) : 0;
        scrollPos = (this.y / (CANVAS_HEIGHT - this.height)) * scrollableArea;
        this.show = (scrollableArea != 0) ? true : false
    }
    draw() {
        if(!this.show) return false
        ctx.fillStyle = (this.hovered) ? "#666" : "#555"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}