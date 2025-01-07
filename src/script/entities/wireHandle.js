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
                    this.lines.push({"from": [fromX, fromY], "to": [toX, toY], "on": destination.currentValue[outputIndex]})
                }
            }
        }
    }
    draw() {
        for(let i=0; i<this.lines.length; i++) {
            ctx.strokeStyle = (this.lines[i].on == 1) ? "red" : "black"
            ctx.lineWidth = 2;
            ctx.beginPath()
            ctx.moveTo(this.lines[i].from[0], this.lines[i].from[1]);
            ctx.lineTo(this.lines[i].to[0], this.lines[i].to[1]);
            ctx.stroke()
            ctx.closePath()
        }
    }
}