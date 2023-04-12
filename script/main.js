

const TowersOfHanoi = function (canvas) {

    /** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext('2d')

    const tower_stick_width = 8;

    /**
     * 
     * @param {string} name 
     * @param {number} x 
     * @param {number} h 
     */
    function Tower(name, x, h) {
        this.name = name;
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
         * @returns {Tile}
         */
        this.popTile = function() {
            return this.tiles.pop()
        }

        this.update = function () {
            this.stroke();
        };

        this.stroke = function () {
            ctx.save();
            ctx.fillStyle = '#996600';
            ctx.translate(this.x, 0);
            ctx.fillRect(-this.width / 2, 0, this.width, this.height);
            ctx.restore();

            this.tiles.forEach(t => t.stroke());
        };

        this.numTiles = function() {
            return this.tiles.length;
        }
    }

    /**
     * 
     * @param {string} color 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    function Tile(color = 0, x = 0, y = 0, width = 180, height = 20) {
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
            ctx.fillStyle = color;
            ctx.translate(x, y);
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        };
    }
 

    var timeStep = 500; // In milliseconds
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    var cmTID;


      // we want (0,0) to be in the lower left corner and y coords from bottom to up
    ctx.translate(0, ch)
    ctx.scale(1 , -1);

    
    // position of towers
    let t1x = cw / 6;
    let t2x = cw / 2;
    let t3x = cw * 5 / 6;
    // tiles: measures and definitions
    const tower_height = 300;
    const N_TILES = 12;
    const tile_height = tower_height / N_TILES ;
    let max_tile_width = cw / 3 - 5;
    let min_tile_width = 20;
    let delta_tile_width = (max_tile_width - min_tile_width) / N_TILES;

    function initializeTowers() {
        var towers = [];
        towers.push(new Tower('A', t1x, tower_height));
        towers.push(new Tower('B', t2x, tower_height));
        towers.push(new Tower('C', t3x, tower_height));
        for (let i = 0; i < N_TILES; i++) {
            // tile.x and y will be calculated in tower.pushTile()
            color = i % 2 == 0 ? '#e6ac00' : '#ffbf00'
            let tile = new Tile(color, 0, 0, max_tile_width - i * delta_tile_width, tile_height);
            towers[0].pushTile(tile)
        }

        return towers;
    }

    this.towers = initializeTowers();
    
    this.stroke = function() {
        ctx.clearRect(0, 0, cw, ch);
        this.towers.forEach(t => t.stroke());
    }


    /**
     * move tower from position a to position b
     * 
     * @param {number} n
     * @param {Tower} source 
     * @param {Tower} target 
     * @param {Tower} auxililiary 
     */
    this.moveTower = function* (n, source, target, auxiliary) {
        console.log(`moveTower(${n}, ${source.name}, ${target.name}, ${auxiliary.name})`)

        if (n > 0) {
            // Move n - 1 disks from source to auxiliary, so they are out of the way
            yield * this.moveTower(n - 1, source, auxiliary, target)
    
            // Move the nth disk from source to target and signal one iteration step
            console.log(`moveTile(${source.name}, ${target.name})`)
            target.pushTile(source.popTile());
            yield target;
    
            // Move the n - 1 disks that we left on auxiliary onto target
            yield * this.moveTower(n - 1, auxiliary, target, source)
        }
    } 


    this.runAndStrokeMoveTowersSequence = function(self, generator) {
        ctx.clearRect(0, 0, cw, ch);
        self.stroke();

        let res = generator.next();
        if (!res.done) {        
            clearTimeout(cmTID);
            cmTID = setTimeout(self.runAndStrokeMoveTowersSequence, timeStep, self, generator);
        } else {
            console.log('--- FINISH ---');
        }
    }

    this.start = function() {
        console.log('--- START ---');
        this.stroke()
        const generator = this.moveTower(N_TILES, this.towers[0], this.towers[2], this.towers[1])
        this.runAndStrokeMoveTowersSequence(this, generator)
    }
 }


$(document).ready(function () {
    var canvas = $("#canvas")[0]
    /** @type {TowersOfHanoi} **/
    var towers = new TowersOfHanoi(canvas);

    towers.start();
})
