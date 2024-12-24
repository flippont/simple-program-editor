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

//render loop
function draw() {
    //run code
    requestAnimationFrame(draw);
    //draw stuff
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sortedEntities.sort((a, b) => a.z - b.z)
    for (let i = 0; i < sortedEntities.length; i++) {
        if (!GAME_PAUSED && !sortedEntities[i].categories.includes("cursor")) {
            sortedEntities[i].run();
            if (!sortedEntities[i]) return
            ctx.wrap(() => {
                sortedEntities[i].draw()
            });
        }

    }
    if(Array.from(category("cursor")).length > 0) {
        Array.from(category("cursor"))[0].run()
        Array.from(category("cursor"))[0].draw()
    }
}

requestAnimationFrame(draw)