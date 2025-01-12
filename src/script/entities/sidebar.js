class SideBar extends Entity {
    constructor() {
        super()
        this.categories = ["sidebar"]
        this.regenerate()
    }
    get z() {
        return 1
    }
    run() {
    }
    regenerate() {
        this.initialBlocks = []
        let blocks = Array.from(category("blocks"));
        for(let block of blocks) {
            block.remove();
        }
        let buttons = Array.from(category("SideButtons"));
        for(let button of buttons) {
            button.remove();
        }
        totalHeight = 0;
        for(let i=0; i<Object.keys(types).length; i++) {
            let data = {input: ["", ""]};
            totalHeight += (i - 1 >= 0) ? 50 : 20;
            add(new Button(
                100, 
                `${totalHeight} - scrollPos`, 
                120, 
                40, 
                Object.keys(types)[i].toUpperCase(), 
                "#303030", 
                false,
                () => {
                    if(Object.keys(types)[i] == "segment") {
                        add(new Segment(MOUSE_POSITION.x, MOUSE_POSITION.y, data))
                    } else if(Object.keys(types)[i] == "LED") {
                        add(new LED(MOUSE_POSITION.x, MOUSE_POSITION.y, data))
                    } else {
                        add(new defaultBlock(MOUSE_POSITION.x, MOUSE_POSITION.y, Object.keys(types)[i], data))
                    }
                }
            ))
        }
    }
    draw() {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, 220, CANVAS_HEIGHT)
    }
}