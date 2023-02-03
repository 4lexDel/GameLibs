class Game extends GameBase { //A renommer ?
    constructor(canvas) {
        super(canvas)

        this.init();
    }

    init() {
        this.start = false;

        this.bornConditions = [3];
        this.surviveConditions = [2, 3];

        this.resize();

        this.initMap(21);

        this.initEvent();

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
    }

    initMap(size) {
        this.map = new Tilemap(size, this.canvas.width, this.canvas.height);

        let voidTile = new TileSet(0, "rgb(240,240,240)");
        let cellTile = new TileSet(1, "black");

        this.map.addTileSet(voidTile);
        this.map.addTileSet(cellTile);
    }

    initEvent() {
        this.startDrag = false;

        this.canvas.onmousedown = (e) => {
            this.startDrag = true;
            this.mouseEditMap(e);
            this.start = false;
        }

        this.canvas.onmousemove = (e) => {
            if (this.startDrag) {
                this.mouseEditMap(e);
            }
        }

        this.canvas.onmouseup = (e) => {
            if (this.startDrag) {
                this.startDrag = false;
                this.mouseEditMap(e);
            }
        }

        this.canvas.addEventListener('touchstart', (e) => {
            this.startDrag = true;

            this.touchEditMap(e);
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.startDrag) {
                this.touchEditMap(e);
            }

        }, false);

        this.canvas.addEventListener('touchend', (e) => {
            this.startDrag = false;

            this.touchEditMap(e);
        }, false);

        window.onresize = (e) => {
            this.resize();
            this.map.resize(this.canvas.width, this.canvas.height); //DRY !!
            //this.draw();
        };

        document.querySelector("#resetMap").addEventListener("click", () => {
            this.map.resetGrid();
            this.start = false;
        });

        document.querySelector("#start").addEventListener("click", () => {
            // this.map.resetGrid();
            // this.draw();
            this.start = !this.start;
        });

        document.querySelector("#generateMap").addEventListener("click", () => {
            let size = document.getElementById("numberCell").value;

            this.initMap(size);
        });

        document.querySelector("#validSettings").addEventListener("click", () => {
            let value = document.getElementById("fpsInput").value;
            this.FPS = value;

            let bornSelect = document.getElementById("bornCondition");
            let bornValues = this.getSelectValues(bornSelect).map(val => parseInt(val));

            let surviveSelect = document.getElementById("surviveCondition");
            let surviveValues = this.getSelectValues(surviveSelect).map(val => parseInt(val));

            // console.log(bornValues);
            // console.log(surviveValues);
            this.bornConditions = bornValues;
            this.surviveConditions = surviveValues;

        });

        document.addEventListener("keyup", (e) => { //KEYBOARD EVENT
            //console.log(e.key);

            switch (e.key) {
                case "Enter":
                    this.start = !this.start;
                    break;

                case "ArrowUp":
                case "ArrowDown":
                    this.map.writeLine(1, false);
                    this.start = false;
                    break;

                case "ArrowRight":
                case "ArrowLeft":
                    this.map.writeLine(1, true);
                    this.start = false;
                    break;

                case "Backspace":
                    this.start = false;
                    this.map.resetGrid();
                    break;
            }
        });
    }

    getSelectValues(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    mouseEditMap(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        let val = e.which == 1 ? 1 : 0;
        this.map.setTileID(coord.x, coord.y, val);
        //this.draw();
    }

    touchEditMap(e) {
        let coord = TouchControl.getTouchPos(this.canvas, e);
        this.map.setTileID(coord.x, coord.y, 1);
    }

    draw() {
        window.requestAnimationFrame(() => this.draw());

        // clamp to fixed framerate
        let now = Math.round(this.FPS * Date.now() / 1000); //FPS
        if (now == this.prevTick) return;
        this.prevTick = now;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);

        if (this.map != null) this.map.display(this.ctx);
        if (this.start) this.calculateNextIteration([3], [2, 3]);
    }

    calculateNextIteration() { //0 => dead / 1 => alive / 2 => will born / 3 => will die
        var update = false;

        for (let x = 0; x < this.map.grid.length; x++) {
            for (let y = 0; y < this.map.grid[x].length; y++) {
                let nbNeighboors = this.countNeighboors(x, y);

                if (this.map.grid[x][y] == 0 && this.bornConditions.indexOf(nbNeighboors) != -1) {
                    this.map.grid[x][y] = 2;
                } else if (this.map.grid[x][y] == 1 && this.surviveConditions.indexOf(nbNeighboors) == -1) {
                    this.map.grid[x][y] = 3;
                }
            }
        }

        for (let x = 0; x < this.map.grid.length; x++) {
            for (let y = 0; y < this.map.grid[x].length; y++) {
                if (this.map.grid[x][y] == 2) {
                    update = true;
                    this.map.grid[x][y] = 1;
                } else if (this.map.grid[x][y] == 3) {
                    update = true;
                    this.map.grid[x][y] = 0;
                }
            }
        }
        if (!update) {
            this.start = false;
        }
    }

    countNeighboors(x, y) {
        let nb = 0;

        if (this.isCellAlive(x + 1, y - 1)) nb++;
        if (this.isCellAlive(x + 1, y)) nb++;
        if (this.isCellAlive(x + 1, y + 1)) nb++;

        if (this.isCellAlive(x - 1, y - 1)) nb++;
        if (this.isCellAlive(x - 1, y)) nb++;
        if (this.isCellAlive(x - 1, y + 1)) nb++;

        if (this.isCellAlive(x, y - 1)) nb++;
        if (this.isCellAlive(x, y + 1)) nb++;

        return nb;
    }

    isCellAlive(x, y) {
        if (x >= 0 && x < this.map.nbSquareX && y >= 0 && y < this.map.nbSquareY) {
            if (this.map.grid[x][y] == 1 || this.map.grid[x][y] == 3) return true;
        }
        return false;
    }
}