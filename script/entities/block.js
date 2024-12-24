class Block extends Entity {
    constructor(x, y, type, data) {
        super();
        this.categories = ["blocks"]
        this.x = x;
        this.y = y;
        this.type = type;
        this.input = (data.inputs || []);
        this.currentValue = 1;
        this.A = 0;
        this.B = 0;
        this.width = types[this.type].width;
        this.height = types[this.type].height;
        this.index;
        this.moving = false;
        this.toggled = false;
        this.initialX = x;
        this.initialY = y;
    }
    run() {
        let evaluate = Array.from(category("blocks"));
        let cursors = Array.from(category("cursor"));

        if(this.x != this.initialX || this.y != this.initialY) {
            if(!MOUSE_DOWN && this.x < 200) {
                this.remove()
            }
        }


        this.A = ((this.input[0] != undefined) ? evaluate[this.input[0]].currentValue : 0)
        this.B = ((this.input[1] != undefined) ? evaluate[this.input[1]].currentValue : 0)
        this.currentValue = eval(types[this.type].function) ? 1 : 0;
        this.hovered = false
        this.index = evaluate.indexOf(this)

        if(!DOWN[32]) {
            this.toggled = false
        }
        if(MOUSE_POSITION.x > this.x - this.width / 2 && MOUSE_POSITION.x < this.x + this.width / 2) {
            if(MOUSE_POSITION.y > (this.y - this.height / 2) && MOUSE_POSITION.y < (this.y + this.height / 2)) {
                this.hovered = true;
                if(DOWN[32] && !this.toggled) {
                    if(types[this.type].togglable) {
                        this.currentValue = (this.currentValue == 0) ? 1 : 0
                    }
                    this.toggled = true;
                }
                if(MOUSE_RIGHT_DOWN && cursors.length == 0 && types[this.type].outputs > 0) {
                    add(new Cursor(this.index))
                }

                if(cursors.length > 0 && !MOUSE_RIGHT_DOWN) {
                    let selected = cursors[0].index;
                    if(selected == this.index || types[this.type].inputs == 0) return

                    if(this.input.length < types[this.type].inputs) {
                        this.input.push(selected)
                    } else {
                        let eachWidth = this.width / this.input.length;
                        this.input[0] = selected;
                        for(let i=0; i<this.input.length; i++) {
                            let innerEdge = (this.x - this.width / 2) + (eachWidth * i);
                            let outerEdge = (this.x - this.width / 2) + (eachWidth * (i + 1));
                            if(MOUSE_POSITION.x > innerEdge && MOUSE_POSITION.x <= outerEdge) {
                                this.input[i] = selected;
                            }
                        }
                    }
                }
                if(MOUSE_DOWN && holding == -1) {
                    holding = this.index;
                }
            }
        }
        if(MOUSE_DOWN) {
            if(holding != this.index) return
            this.layer = 999;
            this.x = MOUSE_POSITION.x;
            this.y = MOUSE_POSITION.y;
        } else {
            this.layer = 20;
            holding = -1
        }

    }
    draw() {
        let display = this.type.toUpperCase();
        if(this.type == "input" || this.type == "output") {
            display = this.currentValue;
        }
        ctx.beginPath()
        ctx.fillStyle = types[this.type].colour
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black"
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        let inputs = types[this.type].inputs;
        for(let i=0; i<inputs; i++) {

        }
        ctx.fill()
        ctx.stroke()
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = "bold 15px Arial"
        ctx.fillStyle = "white"
        ctx.fillText(display, this.x, this.y);
        ctx.closePath()

        if(this.input1 != []) {
            let evaluate = Array.from(category("blocks"));
            for(let i=1; i<=this.input.length; i++) {
                ctx.strokeStyle = "black"
                ctx.beginPath()
                let destination = evaluate[this.input[i - 1]]
                ctx.moveTo(this.x - (this.width / 2) + i * (this.width / (types[this.type].inputs + 1)), this.y - (this.height / 2));
                ctx.lineTo(destination.x, destination.y + (this.height / 2))
                ctx.stroke()
                ctx.closePath()
            }
        }
    }
}