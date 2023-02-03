function getWidth() {
    return Math.max(
        //document.body.scrollWidth,
        // document.documentElement.scrollWidth,
        // document.body.offsetWidth,
        // document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        //document.body.scrollHeight,
        // document.documentElement.scrollHeight,
        // document.body.offsetHeight,
        // document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
} //Get the pos with the target element and the event

function getTouchPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    var touchobj = evt.changedTouches[0];
    let x = parseInt(touchobj.clientX);
    let y = parseInt(touchobj.clientY);

    return {
        x: x - rect.left,
        y: y - rect.top
    }
}