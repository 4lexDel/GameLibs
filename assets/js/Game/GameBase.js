class GameBase {
    constructor(canvas) {
        this.canvas = canvas;

        this.ctx = this.canvas.getContext("2d");

        window.onresize = (e) => {
            this.canvas.resize();
        };
    }

    resize() {
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
    }


}