var Game_Over = {

    preload : function() {
	// TODO: create gameover.png
        game.load.image('gameover', './assets/images/gameover.png');
    },

    create : function() {

        // Create button to start game similar to the main menu.
        this.add.button(0, 0, 'gameover', this.startGame, this);

    },

    startGame: function () {
        // Change the state to the actual game.
        this.state.start('Game');
    }

};
