class Tilemap {

    constructor(nbSquareX, canvasWidth, canvasHeight) {
        this.nbSquareX = parseInt(nbSquareX);

        this.canvasWidth;
        this.canvasHeight;

        this.tileSets = [];

        this.resize(canvasWidth, canvasHeight);
    }

    addTileSet(tileSet) {
        this.tileSets.push(tileSet);
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.dx = canvasWidth / this.nbSquareX;
        this.dy = this.dx;

        this.nbSquareY = parseInt(canvasHeight / this.dx) + 1;

        this.grid = new Array(this.nbSquareX);
        for (var x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(this.nbSquareY);
        }
        this.resetGrid();
    }

    display(ctx) { //Perf ??
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                for (let i = 0; i < this.tileSets.length; i++) {
                    if (this.grid[x][y] == this.tileSets[i].id) {
                        ctx.fillStyle = this.tileSets[i].color; //"#68B052";
                        ctx.globalAlpha = this.tileSets[i].opacity;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;
                    }
                }
                ctx.strokeStyle = "rgb(80,80,80)";
                ctx.lineWidth = 0.1;
                ctx.strokeRect(x * this.dx, y * this.dy, this.dx, this.dy);
            }
        }
    }

    setTileID(x, y, value) {
        if (x < 0 || x > this.canvasWidth || y < 0 || y > this.canvasHeight) return null;

        let mx = parseInt(x / this.dx);
        let my = parseInt(y / this.dy);

        this.grid[mx][my] = value;
    }

    resetGrid() {
        let value = 0;

        if (this.tileSets.length > 0) value = this.tileSets[0].id;

        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = value;
            }
        }
    }

    writeLine(value, direction = true) {
        var x, y;

        if (direction) {
            y = parseInt(this.nbSquareY / 2);

            for (let x = 0; x < this.grid.length; x++) {
                this.grid[x][y] = value;
            }
        } else {
            x = parseInt(this.nbSquareX / 2);

            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = value;
            }
        }
    }
}