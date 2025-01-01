class SideBar extends Entity {
    constructor() {
        super()
        this.categories = ["sidebar"]
        this.regenerate()
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
            add(new Button(100, i * (types[Object.keys(types)[i]].height + 20) + 50, types[Object.keys(types)[i]].width, types[Object.keys(types)[i]].height, Object.keys(types)[i]))
        }
    }
    draw() {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, 200, CANVAS_HEIGHT)
    }
}