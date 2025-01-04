class SideBar extends Entity {
    constructor() {
        super()
        this.categories = ["sidebar"]
        this.regenerate()
        add(new Button(
            "CANVAS_WIDTH - 70", 
            50, 
            100, 
            40, 
            "Create", 
            "#ggg", 
            () => {
                openPopUp()
            }
        ))
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
        for(let i=0; i<Object.keys(types).length; i++) {
            let data = {input: ["", ""]};
            let display = Object.keys(types)[i].toUpperCase();
            if(Object.keys(types)[i] == "input") {
                display = 1;
            }
            if(Object.keys(types)[i] == "output") {
                display = 0;
            }
            add(new Button(
                100, 
                i * (types[Object.keys(types)[i]].height + 20) + 50, 
                types[Object.keys(types)[i]].width, 
                types[Object.keys(types)[i]].height, 
                display, 
                types[Object.keys(types)[i]].colour, 
                () => {
                    add(new Block(MOUSE_POSITION.x, MOUSE_POSITION.y, Object.keys(types)[i], data))
                }
            ))
        }
    }
    draw() {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, 200, CANVAS_HEIGHT)
    }
}