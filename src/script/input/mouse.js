MOUSE_DOWN = false;
MOUSE_RIGHT_DOWN = false;
MOUSE_POSITION = {x: 0, y: 0};
DOWN_MOUSE_POSITION = {x: 0, y: 0};
MOUSE_SCROLL = 0;

onmousedown = (evt) => {
    getEventPosition(evt, canvas, DOWN_MOUSE_POSITION);
    (evt.button == 2) ? MOUSE_RIGHT_DOWN = true : MOUSE_DOWN = true
};
onmouseup = (evt) => evt.button == 2 ? MOUSE_RIGHT_DOWN = false : MOUSE_DOWN = false;
onmousemove = (evt) => getEventPosition(evt, canvas, MOUSE_POSITION);

oncontextmenu = (evt) => evt.preventDefault();
onwheel = (evt) => {
    evt.preventDefault();
    MOUSE_SCROLL = evt.deltaY * 0.5;
};

getEventPosition = (event, can, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * can.width;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * can.height;
}