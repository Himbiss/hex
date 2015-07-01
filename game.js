var board, points_p1, points_p2, boardSize, board_off_x, board_off_y;

// Invoked if a hexagon is clicked
function hexClicked(sprite, pointer) {
	sprite.loadTexture('hex_red');
	console.log('clicked a sprite'+sprite.key);
}

// Draws the top border. Inv inverses the border
function drawBoardBorderTop(graphics, color, x, y, inv) {
	var start_x = x, start_y = y;

	graphics.beginFill(color);
	graphics.lineStyle(1, 0x000000);

	graphics.moveTo(x,y-40*inv);
	graphics.lineTo(x-20*inv,y-20*inv);
	graphics.lineTo(x,y);
	var adv = hexagonSize/2+2;
	x += inv*(adv+3);
	y -= inv*(2+adv/2);
	graphics.lineTo(x,y);

        for(var i = 1; i < boardSize; i++) {
		x += inv*(adv);
		y += inv*(adv/2);
		graphics.lineTo(x,y);
		x += inv*(adv);
		y -= inv*(adv/2);
		graphics.lineTo(x,y);
	}

	x += 16*inv;
	y -= 27*inv;
	graphics.lineTo(x,y);

	graphics.endFill();
}

// Draws the left border. Inv inverses the border
function drawBoardBorderLeft(graphics, color, x, y, inv) {
	var start_x = x, start_y = y;

	graphics.beginFill(color);
	graphics.lineStyle(1, 0x000000);

	graphics.moveTo(x-40*inv,y);
	graphics.lineTo(x-20*inv,y-20*inv);
	graphics.lineTo(x,y);

	var adv = hexagonSize/2;
	for(var i = 0; i < boardSize; i++) {
		y += inv*(adv+hexagonSize/8);
		graphics.lineTo(x,y);
		x += inv*adv;
		y += inv*(adv/2);
		graphics.lineTo(x,y);
	}
	y += 4*inv;
	x += 6*inv;
	graphics.lineTo(x,y);
	
	x -= 16*inv;
	y += 25*inv;
	graphics.lineTo(x,y);
		

	graphics.endFill();
}

// Create the game object
var Game = {

    preload : function() {
        // Here we load all the needed resources for the level.
        game.load.image('hex_blue', './assets/images/hexagon_blue.png');
        game.load.image('hex_red', './assets/images/hexagon_red.png');
	game.load.image('hex_border', './assets/images/hexagon_border.png');
    },

    create : function() {
	
	// Initialize global variables
	board_off_x = 75;
	board_off_y = 40;
	boardSize = 10;
	board = [];
	hexagonSize = 42;
	
        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#808080';

	// Draw the borders of the board
	var graphics = game.add.graphics(100, 100);		
	drawBoardBorderLeft(graphics, 0xed2624, -30, -52, 1);
	drawBoardBorderLeft(graphics, 0xed2624, 625, 303, -1);
	drawBoardBorderTop(graphics, 0x207199, -30, -52, 1);
	drawBoardBorderTop(graphics, 0x207199, 625, 303, -1);

        // Generate the initial board
	var off=0;
        for(var i = 0; i < boardSize; i++) {
		board[i] = [];
		for(var j = 0; j < boardSize; j++) { 
			board[i][j] = game.add.sprite(board_off_x+off+j*hexagonSize+j*4, board_off_y+i*hexagonSize-off/4, 'hex_border');
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
