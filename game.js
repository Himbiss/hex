var board, points_p1, points_p2, boardSize;

function hexClicked(sprite, pointer) {
	sprite.loadTexture('hex_red');
	console.log('clicked a sprite'+sprite.key);
}


var Game = {

    preload : function() {
        // Here we load all the needed resources for the level.
        game.load.image('hex_blue', './assets/images/hexagon_blue.png');
        game.load.image('hex_red', './assets/images/hexagon_red.png');
	game.load.image('hex_border', './assets/images/hexagon_border.png');
    },

    create : function() {
	
	// Initialize global variables
	boardSize = 11;
	board = [];
	hexagonSize = 42;
	
        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#808080';

        // Generate the initial board
	var off=0;
        for(var i = 0; i < 10; i++){
		board[i] = [];
		for(var j=0; j<10; j++) { 
			board[i][j] = game.add.sprite(off+j*hexagonSize+j*4, i*hexagonSize-off/4, 'hex_border');
			board[i][j].scale.setTo(hexagonSize/200,hexagonSize/234);
			board[i][j].inputEnabled = true;
			board[i][j].userHandCursor = true;
			board[i][j].events.onInputDown.add(hexClicked,this);
		}
		off += hexagonSize/2;
        }
    },

    update: function() {
	// TODO: implement
    }
};
