var game;

game = new Phaser.Game(800, 450, Phaser.AUTO, 'create: eurecaClientSetup');

game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Game_Over', Game_Over);
game.state.add('Search_Games', Search_Games);


game.state.start('Menu');
