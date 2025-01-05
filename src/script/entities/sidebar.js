class SideBar extends Entity {
    constructor() {
        super()
        this.categories = ["sidebar"]
        this.regenerate()
        add(new Button(
            "CANVAS_WIDTH - 70", 
            20, 
            100, 
            40, 
            "Create", 
            "#111", 
            false,
            () => {
                openPopUp()
            }
        ))
        add(new Button(
            "CANVAS_WIDTH - 70", 
            70,
            100, 
            40, 
            "Clear", 
            "#111", 
            false,
            () => {
                clearBlocks()
            }
        ))
        add(new scrollBar(200, 0, 20, 100))
    }
    get z() {
        return 10
    }
    run() {
    }
    regenerate() {
        this.initialBlocks = []
        let blocks = Array.from(category("blocks"));
        for(let block of blocks) {
            block.remove();
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