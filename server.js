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

// called by the client to execute a move on the current game
eurecaServer.exports.makeMove = function(i, j) {
	var game = clients[this.connection.id].game;
	if(game.player1.id == this.connection.id) {
		game.player2.remote.makeMove(i, j);
	} else {
		game.player1.remote.makeMove(i, j);
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
