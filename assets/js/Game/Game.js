class Game extends GameBase { //A renommer ?
    constructor(canvas) {
        super(canvas)

        this.init();
    }

    init() {
        this.start = false;

        this.map = new Tilemap(81, this.canvas.width, this.canvas.height);

        let voidTile = new TileSet(0, "rgb(240,240,240)");
        let cellTile = new TileSet(1, "black");

        this.map.addTileSet(voidTile);
        this.map.addTileSet(cellTile);

        this.resize();
        this.map.resize(this.canvas.width, this.canvas.height);

        this.initEvent();


        /*---------Draw settings----------*/
        this.FPS = 100;
        this.prevTick = 0;
        this.draw();
    }

    initEvent() {
        this.startDrag = false;

        this.canvas.onmousedown = (e) => {
            this.startDrag = true;
            this.editMap(e);
            this.start = false;
        }

        this.canvas.onmousemove = (e) => {
            if (this.startDrag) {
                this.editMap(e);
            }
        }

        this.canvas.onmouseup = (e) => {
            if (this.startDrag) {
                this.startDrag = false;
                this.editMap(e);
            }
        }

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

    editMap(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        let val = e.which == 1 ? 1 : 0;
        this.map.setTileID(coord.x, coord.y, val);
        //this.draw();
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

    calculateNextIteration(bornConditions, surviveConditions) { //0 => dead / 1 => alive / 2 => will born / 3 => will die
        var update = false;

        for (let x = 0; x < this.map.grid.length; x++) {
            for (let y = 0; y < this.map.grid[x].length; y++) {
                let nbNeighboors = this.countNeighboors(x, y);

                if (this.map.grid[x][y] == 0 && bornConditions.indexOf(nbNeighboors) != -1) {
                    this.map.grid[x][y] = 2;
                } else if (this.map.grid[x][y] == 1 && surviveConditions.indexOf(nbNeighboors) == -1) {
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