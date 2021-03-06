function $(selector, container) {
    return (container || document).querySelector(selector);
};

(function() {

    var _ = self.Life = function(seed){
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray(seed);
    };

_.prototype = {
    next: function(){
        this.prevBoard = cloneArray(this.board);

        for (var y = 0; y < this.height; y++){
            for (var x = 0; x < this.width; x++){
                var neighbours = this.aliveNeighbours(this.prevBoard, x, y);
                var alive = !!this.board[y][x];

                if (alive){
                    if (neighbours < 2 || neighbours > 3){
                        this.board[y][x] = 0;
                    }
                }
                else {
                    if (neighbours == 3){
                        this.board[y][x] = 1;
                    }
                }
            }
        }
    },

    aliveNeighbours: function(array, x, y){
        var prevRow = array[y - 1] || [];
        var nextRow = array[y + 1] || [];

        return [
            prevRow[x - 1], prevRow[x], prevRow[x+1],
            array[y][x-1], array[y][x+1],
            nextRow[x - 1], nextRow[x], nextRow[x+1],
        ].reduce(function (prev, cur) {
            return prev + +!!cur;
        }, 0);
    },
    
    toString: function(){
        return this.board.map(function(row){return row.join(' '); }).join('\n');
    }
};

// Helpers
// Only clones 2d arrays
function cloneArray(array) {
    return array.slice().map(function(row){return row.slice();});
}

})();

(function() {
var _ = self.LifeView = function (table, size) {
        this.grid = table;
        this.size = size;
        this.started = false;
        this.autoplay = false;

        this.createGrid();
};

_.prototype = {
    createGrid: function () {
        var fragment = document.createDocumentFragment();
        this.grid.innerHTML = '';
        this.checkboxes = [];

        for (var y = 0; y < this.size; y++){
            var row = document.createElement('tr');
            this.checkboxes[y] = [];

            for (var x = 0; x < this.size; x++){
                var cell = document.createElement('td');
                var checkbox = document.createElement(('input'));
                checkbox.type = 'checkbox';
                this.checkboxes[y][x] = checkbox;

                cell.appendChild(checkbox);
                row.appendChild(cell);
                
            }
            fragment.appendChild(row);
        }

        this.grid.appendChild(fragment);
    },

    get boardArray() {
        return this.checkboxes.map(function (row) {
            return row.map(function (checkbox) {
                return +checkbox.checked;
            });
        });
    },

    play: function() {
        this.game = new Life(this.boardArray);
        this.started = true;
    },

    next: function() {
        var me = this;

        if(!this.started || this.game){
            this.play();
        }

        this.game.next();

        var board = this.game.board;

        for (var y = 0; y < this.size; y ++){
            for (var x = 0; x < this.size; x++){
                this.checkboxes[y][x].checked = !!board[y][x];
            }
        }

        if (this.autoplay) {
            this.timer = setTimeout(function() {
                me.next();
            }, 1000);
        }
    }
}
})();

var lifeView = new LifeView(document.getElementById('grid'), 13);

(function(){

var buttons = {
    next: $('button.next'),
    autoplay: $('input#autoplay')
};

buttons.next.addEventListener('click', function() {
    lifeView.next();
});

buttons.autoplay.addEventListener('change', function(){
    buttons.next.disabled = this.checked;

    lifeView.autoplay = this.checked;

    if (this.checked){
        lifeView.autoplay = this.checked;
        lifeView.next();
    }
    else {
        clearTimeout(lifeView.timer);
    }
});
})();