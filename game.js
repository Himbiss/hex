// Global variables
var board, points_p1, points_p2, boardSize, board_off_x, board_off_y;
var ready = false, myTurn = false;
var eurecaServer;
var Game;
var won_state = 0; // 0:won, 1:lost, 2:opponentQuit

// Setup the EurecaClient
var eurecaClientSetup = function() {
	// Create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();

	eurecaClient.ready(function (proxy) {
		console.log("Eureca is ready");
		eurecaServer = proxy;
	});

	eurecaClient.exports.setId = function(id) {
		myId = id;
	}

	eurecaClient.exports.startGame = function(turn) {
		myTurn = turn;
		game.state.start('Game');
		ready = true;
		console.log("Started the game, myTurn:%s",myTurn);
	}

	eurecaClient.exports.makeMove = function(i, j) {
		board[i][j].loadTexture('hex_blue');
		myTurn = true;
	}
	
	eurecaClient.exports.opponentQuit = function() {
		won_state = 2;
		myTurn = false;
		game.state.start('Game_Over');
	}

	eurecaClient.exports.endGame = function(won) {
		won_state = won ? 0 : 1;
		myTurn = false;
		game.state.start('Game_Over');
	}
}


// Invoked if a hexagon is clicked
function hexClicked(sprite, pointer) {
	if(myTurn) {
	    sprite.loadTexture('hex_red');
	    console.log('clicked hexagon '+sprite.i+' '+sprite.j);
	    eurecaServer.makeMove(sprite.i,sprite.j);
	    myTurn = false;
	}
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
Game = {

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

        game.stage.backgroundColor = '#ffffff';

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
			board[i][j].i = i;
			board[i][j].j = j;
			board[i][j].scale.setTo(hexagonSize/200,hexagonSize/234);
			board[i][j].inputEnabled = true;
			board[i][j].userHandCursor = true;
			board[i][j].events.onInputDown.add(hexClicked,this);
		}
		off += hexagonSize/2;
        }

	// Add the players name labels
	var you_txt = game.add.text(50, 350, "You");
	you_txt.font = 'bold 16px sans-serif';
	you_txt.fontSize = 33;
	you_txt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	var opponent_txt = game.add.text(600, 50, "Opponent");
	opponent_txt.font = 'bold 16px sans-serif';
	opponent_txt.fontSize = 33;
	opponent_txt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	var you_grd = you_txt.context.createLinearGradient(0, 0, 0, you_txt.canvas.height);
	you_grd.addColorStop(0, '#ed2624');
	you_grd.addColorStop(1, '#992a20');
	you_txt.fill = you_grd;

	var opponent_grd = opponent_txt.context.createLinearGradient(0, 0, 0, opponent_txt.canvas.height);
	opponent_grd.addColorStop(0, '#207199');
	opponent_grd.addColorStop(1, '#2184b4');
	opponent_txt.fill = opponent_grd;
    },

};
