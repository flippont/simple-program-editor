add(new SideBar())
canvasPrototype.wrap = function(f) {
    const { resolveColor } = this;
    this.save();
    f();
    this.restore();
    this.resolveColor = resolveColor || (x => x);
}

function category(category) {
    return entityCategories.get(category) || [];
}

function clearBlocks() {
    let blocks = Array.from(category("blocks"))
    blocks.forEach((element) => {
        element.remove()
    })
}

function generateBlocksArray() {
    let blocks = Array.from(category("blocks"));
    let returnArray = []
    for(let i=0; i<blocks.length; i++) {
        returnArray.push({
            "x": Math.floor(blocks[i].x),
            "y": Math.floor(blocks[i].y),
            "data": {
                "inputs": blocks[i].data.inputs,
                "outputs": blocks[i].data.outputs
            },
            "type": blocks[i].type
        })
    }
    return returnArray
}

function add(entity) {
    if (entities.has(entity)) return;
    entities.add(entity)

    sortedEntities.push(entity)
    for (const category of entity.categories) {
        if (!entityCategories.has(category)) {
            entityCategories.set(category, new Set([entity]));
        } else {
            entityCategories.get(category).add(entity);
        }
    }
    return entity;
}
let lastFrame = performance.now();

//render loop
function draw() {
    document.body.style.cursor = "default"
    const current = performance.now();
    const elapsed = (current - lastFrame) / 1000;
    lastFrame = current;

    //run code
    requestAnimationFrame(draw);
    //draw stuff
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.textAlign = "right"
    ctx.font = "bold 15px Arial"
    ctx.fillStyle = "#000";
    let y = CANVAS_HEIGHT;
    for (const line of [
        (DEBUG) ? ("FPS: " + ~~(1 / elapsed)) : "",
        (DEBUG) ? ("Entities: " + sortedEntities.length) : "",
        "Version: " + version,
    ].reverse()) {
        y -= 20;
        ctx.fillText(line, CANVAS_WIDTH - 20, y);
    }

    debug.style.display = "none"
    sortedEntities.sort((a, b) => a.z - b.z)
    for (let i = 0; i < sortedEntities.length; i++) {
        if (!GAME_PAUSED) {
            sortedEntities[i].run();
            if (!sortedEntities[i]) return
            ctx.wrap(() => {
                sortedEntities[i].draw()
            });
        }

    }
}

requestAnimationFrame(draw)