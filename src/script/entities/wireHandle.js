class WireHandle extends Entity {
    constructor() {
        super()
        this.lines = []
    }
    get z() {
        return 2;
    }
    run() {
        let evaluate = Array.from(category("blocks"));
        this.lines = [];
        for(let i=0; i<evaluate.length; i++) {
            let isolateInput = evaluate[i].data.inputs;
            for(let j=0; j<isolateInput.length; j++) {
                if(isolateInput[j] && isolateInput[j] != -1) {
                    let destination = evaluate[isolateInput[j][0]];
                    let outputIndex = isolateInput[j][1]
                    if(destination == undefined || outputIndex == undefined) return;
                    let fromX = evaluate[i].x - (evaluate[i].width / 2) + (j + 1) * (evaluate[i].width / (types[evaluate[i].type].inputs + 1));
                    let fromY = evaluate[i].y - (evaluate[i].height / 2);
                    let toX = destination.x - (destination.width / 2) + (outputIndex + 1) * (destination.width / (types[destination.type].outputs + 1));
                    let toY = destination.y + (destination.height / 2);
                    let hovered = false;
                    if(this.linePoint(fromX, fromY, toX, toY, MOUSE_POSITION.x, MOUSE_POSITION.y)) {
                        hovered = true;
                    }
                    if(MOUSE_RIGHT_DOWN && hovered) {
                        destination.data.outputs[isolateInput[j][1]] = [];
                        evaluate[i].data.inputs[j] = [-1]
                    } else {
                        this.lines.push({"from": [fromX, fromY], "to": [toX, toY], "on": destination.currentValue[outputIndex], "hovered": hovered})
                    }
                }
            }
        }
    }
    draw() {
        for(let i=0; i<this.lines.length; i++) {
            ctx.beginPath()
            ctx.moveTo(this.lines[i].from[0], this.lines[i].from[1]);
            ctx.lineTo(this.lines[i].to[0], this.lines[i].to[1]);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "red"
            if(this.lines[i].hovered) {
                ctx.stroke()
            }
            ctx.strokeStyle = (this.lines[i].on == 1) ? "#D82D32" : "#242428"
            ctx.lineWidth = 2;
            ctx.stroke()
            ctx.closePath()
        }
    }
    dist(x1, y1, x2, y2) {
        let squaredX = Math.pow((x1 - x2), 2)
        let squaredY = Math.pow((y1 - y2), 2)
        return Math.sqrt(squaredX + squaredY)
    }
    linePoint(x1, y1, x2, y2, px, py) {
        let d1 = this.dist(px, py, x1, y1);
         let d2 = this.dist(px, py, x2, y2);
        let lineLen = this.dist(x1, y1, x2, y2);
        let buffer = 0.5;
        if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
            return true;
        }
        return false;
      }
}