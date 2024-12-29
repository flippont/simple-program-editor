class Entity {
    constructor () {
        this.x = this.y = 0;
        this.categories = [];
        this.layer = 0;
    }

    get z() {
        return this.layer;
    }

    run() {
        
    }
    
    remove() {
        entities.delete(this);
        for (const category of this.categories) {
            if (entityCategories.has(category)) {
                entityCategories.get(category).delete(this);
            }
        }
        
        const index = sortedEntities.indexOf(this);
        if (index >= 0) sortedEntities.splice(index, 1);
    }
    draw() {
        
    }
}