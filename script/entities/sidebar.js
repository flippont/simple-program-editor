class SideBar extends Entity {
    constructor() {
        super()
        this.categories = ["sidebar"]
        this.initialBlocks = []
        for(let i=0; i<Object.keys(types).length; i++) {
            let data = {input: []}
            let block = add(new Block(100, i * (types[Object.keys(types)[i]].height + 10) + 50, Object.keys(types)[i], data))
            this.initialBlocks.push(block)
            block.layer = 2000;
        }
    }
    get z() {
        return 10
    }
    run() {
        for(let i=0; i<this.initialBlocks.length; i++) {
            if(this.initialBlocks[i].x != this.initialBlocks[i].initialX || this.initialBlocks[i].y != this.initialBlocks[i].initialY) {
                let data = {input: []}
                let block = add(new Block(100, i * (types[Object.keys(types)[i]].height + 10) + 50, Object.keys(types)[i], data))
                this.initialBlocks[i] = block;
            }
        }
    }
    draw() {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, 200, CANVAS_HEIGHT)
    }
}