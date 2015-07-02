var Search_Games = {

	preload : function() {

	},

	create : function() {
  	    // Set a white background
	    game.stage.backgroundColor = '#ffffff';

	    // Populate the menu screen with some text
	    // and a rotating hexagon as the start button
	    var txt = this.add.text(400, 100, "Searching Games...");
	    txt.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	    txt.font = 'bold 16px sans-serif';
	    txt.fontSize = 50;
	    // Set the style of the text to a linear gradient from top to bottom
	    var grd = txt.context.createLinearGradient(0, 0, 0, txt.canvas.height);
	    grd.addColorStop(0, '#8ED6FF');
	    grd.addColorStop(1, '#004CB3');
	    txt.fill = grd;
	    txt.anchor.x = .5;
	    txt.anchor.y = .5;

	    var tween_txt = this.add.tween(txt.scale);
	    tween_txt.to({x : 1.5, y : 1.5},2000, Phaser.Easing.Linear.None, true, 0, 9999, true).loop(true);
    	    tween_txt.start();

	    eurecaClientSetup(); 
	}


};
