

const TowersOfHanoi = function (canvas) {

    /** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext('2d')

    const tower_stick_width = 5;

    function Tower(x, h) {
        this.x = x;
        this.height = h;
        this.width = tower_stick_width;
        this.tiles = []

        this.pushTile = function(t) {
            t.x = this.x
            t.y = t.height / 2 + this.tiles.length * t.height;
            this.tiles.push(t);
        }

        /**
         * 
         * @returns Tile
         */
        this.popTile = function() {
            return this.tiles.pop()
        }

        this.update = function () {
            this.stroke();
        };

        this.stroke = function () {
            ctx.save();
            ctx.fillStyle = 'brown';
            ctx.translate(this.x, 0);
            ctx.fillRect(-this.width / 2, 0, this.width, this.height);
            ctx.restore();

            this.tiles.forEach(t => t.stroke());
        };

        this.numTiles = function() {
            return this.tiles.length;
        }
    }

    function Tile(x, y, width = 180, height = 20) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
 
        this.update = function () {
            this.stroke();
        };

        this.stroke = function () {
            ctx.save();
            var x = this.x;
            var y = this.y;
            ctx.fillStyle = 'black';
            ctx.translate(x, y);
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        };
    }
 

    var timeStep = 50; // In milliseconds
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    var cmTID;

    function updateAll() {
        ctx.clearRect(0, 0, cw, ch);
        for (var i = 0; i < boxes.length; i = i + 1) {
            boxes[i].update();
        }
        
        tile.update();
        clearTimeout(cmTID);
        cmTID = setTimeout(updateAll, timeStep);
    }


    // Create the boxes
    var boxes = [];


    // we want (0,0) to be in the lower left corner and y coords from bottom to up
    ctx.translate(0, ch)
    ctx.scale(1 , -1);

    
    // position of towers
    let t1x = cw / 6;
    let t2x = cw / 2;
    let t3x = cw * 5 / 6;
    // tiles: measures and definitions
    const tower_height = 300;
    const n_tiles = 10;
    const tile_height = tower_height / n_tiles ;
    let max_tile_width = cw / 3 - 5;
    let min_tile_width = 20;
    let delta_tile_width = (max_tile_width - min_tile_width) / n_tiles;

    function initializeTowers() {
        var towers = [];
        towers.push(new Tower(t1x, tower_height));
        towers.push(new Tower(t2x, tower_height));
        towers.push(new Tower(t3x, tower_height));
        for (let i = 0; i < n_tiles; i++) {
            // tile.x and y will be calculated in tower.pushTile()
            let tile = new Tile(0, 0, max_tile_width - i * delta_tile_width, tile_height);
            towers[0].pushTile(tile)
        }

        return towers;
    }


    var towers = initializeTowers();

    
    // Do the first update
    // updateAll();
    
    this.stroke = function() {
        
        towers.forEach(t => t.stroke());
    }


    /**
     * 
     * @param {number} a 
     * @param {number} b 
     */
    this.moveTile = function(a, b) {
        console.log(`moveTile(${a}, ${b})`)
        let t = towers[a].popTile()
        towers[b].pushTile(t)
    }

    /**
     * move tower from position a to position b
     * 
     * @param {number} a 
     * @param {number} b 
     */
    this.moveTower = function(a, b) {
        console.log(`moveTower(${a}, ${b})`)
        let c = [0, 1, 2].filter(item => ![a, b].includes(item)).at(0);

        if (towers[a].numTiles() == 0) {
            return;
        }

        this.moveTile(a, c);
        
        this.moveTower(a, b);

        this.moveTile(c, b);
    } 

    this.startMovingTowers = function() {
        this.moveTower(0, 2);
    }

}


$(document).ready(function () {
    var canvas = $("#canvas")[0]
    towers = new TowersOfHanoi(canvas);

    towers.stroke();
    towers.startMovingTowers();
})
