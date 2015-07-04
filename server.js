// get express and setup server
var express = require('express'), app = express(app), server = require('http').createServer(app);

// serve static files from the current directory
app.use(express.static(__dirname));

// get Eureca
var Eureca = require('eureca.io');

// create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'startGame', 'endGame', 'makeMove', 'opponentQuit']});

// attach eureca.io to our http server
eurecaServer.attach(server);

// hold all clients
var clients = {};

// hold all games
var games = [];

var boardSize = 10;

checkGameEnd = function(moves) {
	// create and fill a board with the moves
	var board = [];
	for(var i=0; i<boardSize; i++) {
		board[i] = [];
		for(var j=0; j<boardSize; j++) {
			board[i][j] = 0;
		}
	}	

	var player1 = 1;
	for(var c in moves) {
		var move = moves[c];
		board[move.i][move.j] = player1;	
		player1 = (player1==1) ? 2 : 1;
	}

	var gameEnded = false;
	// check the board for paths from top to bottom
	for(var i=0; i<boardSize; i++) {
		if(board[i][0] != 0) {
			gameEnded |= checkForPath(board, board[i][0], i, 0, true, []);
		}
	}

	// check the board for paths from left to right
	for(var j=0; j<boardSize; j++) {
		if(board[0][j] != 0) {
			gameEnded |= checkForPath(board, board[0][j], 0, j, false, []);
		}
	}

	// return the result
	return gameEnded;
}


checkForPath = function(board, color, i, j, fromTop, path) {
	// check if indexes are in boundi and if the color is rights
	if(i<0 || j<0 || i>=boardSize || j>=boardSize || board[i][j] != color)
		return false;
	
	// check if this cell was already used in the path
	for(var c in path) {
		var cell = path[c];
		if(cell.i == i && cell.j == j)
			return false;
	}

	// mark this cell as used
	path.push({i:i, j:j}); 

	var hasPath = false;
	if(fromTop) {
		// check if we reached the other side
		if(j == boardSize-1)
			return true;
		// search from the top to the bottom
		hasPath |= checkForPath(board, color, i, j+1, fromTop, path); // one down
		hasPath |= checkForPath(board, color, i-1, j+1, fromTop, path); // one down and left
		hasPath |= checkForPath(board, color, i+1, j, fromTop, path); // one left
		hasPath |= checkForPath(board, color, i-1, j, fromTop, path); // one right
		hasPath |= checkForPath(board, color, i, j-1, fromTop, path); // one up
		hasPath |= checkForPath(board, color, i+1, j-1, fromTop, path); // one up and right
	} else {
		// check if we reached the other side
		if(i == boardSize-1)
			return true;
		// search from left to right
		hasPath |= checkForPath(board, color, i+1, j, fromTop, path); // one right
		hasPath |= checkForPath(board, color, i+1, j-1, fromTop, path); // one right and up
		hasPath |= checkForPath(board, color, i, j-1, fromTop, path); // one up
		hasPath |= checkForPath(board, color, i, j+1, fromTop, path); // one down
		hasPath |= checkForPath(board, color, i-1, j, fromTop, path); // one left
		hasPath |= checkForPath(board, color, i-1, j+1, fromTop, path); // one left and down
	}
	return hasPath;
}

killGame = function(game) {
	console.log("Deleted Game between "+game.player1.id+" and "+game.player2.id);
	delete clients[game.player1.id];
	delete clients[game.player2.id];
	delete game;	
}

// called by the client to execute a move on the current game
eurecaServer.exports.makeMove = function(i, j) {
	var game = clients[this.connection.id].game;
	if(game.player1.id == this.connection.id) {
		game.player2.remote.makeMove(j, i);
		game.moves.push({i:i, j:j, player:1});
		game.currentPlayer = game.player1.id;
		if(checkGameEnd(game.moves)) {
			game.player1.remote.endGame(true);
			game.player2.remote.endGame(false);
			killGame(game);
		}
	} else {
		game.player1.remote.makeMove(j, i);
		game.moves.push({i:j, j:i, player:2});
		game.currentPlayer = game.player2.id;
		if(checkGameEnd(game.moves)) {
			game.player1.remote.endGame(false);
			game.player2.remote.endGame(true);
			killGame(game);
		}
	}
	
}

// detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
    var remote = eurecaServer.getClient(conn.id);
    var newClient = {game: null, id:conn.id, remote:remote};
    remote.setId(conn.id);

    // if a client without a matched game exists,
    // create a new game with this client
    for(var c in clients) {
	var client = clients[c];
	if(games[client.id] == null) {
		// create a new game and add it to the two connections
		var game = {currentPlayer: null, moves: [], player1: client, player2: newClient};
		client.game = game;
		newClient.game = game;
		console.log('Created a new game between client1=%s and client2=%s', client.id, newClient.id);
		// start the game
		var isTurn = !!Math.floor(Math.random() * 2);	        	
		remote.startGame(!isTurn);
		var remote1 = eurecaServer.getClient(client.id);
		remote1.startGame(isTurn);
		game.currentPlayer = isTurn ? client : newClient;
		games.push(game);
	}	
    }

    // add client to clients
    clients[conn.id] = newClient;
});

// detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected id=%s ', conn.id);
    if(clients[conn.id] != null) {
        var game = clients[conn.id].game;
        if(game != null) {
	    // delete the current game
	    console.log('Deleted game between client1=%s and client2=%s', game.player1.id, game.player2.id);
	    game.player1.game = null;
	    game.player2.game = null;

	    // notify other player that the opponent has quit the game
	    // and quit their connections
	    if(game.player1.id == conn.id) {
		game.player2.remote.opponentQuit();
		delete clients[game.player2.id];
	    } else {
		game.player1.remote.opponentQuit();
		delete clients[game.player1.id];
	    }
	    delete game;
        }
        delete clients[conn.id];
    }
});

// listen on port 8000
server.listen(8000);
