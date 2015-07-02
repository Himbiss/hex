// called if the mouse hovers over the hexagon
function buttonHover(btn, context) {
	btn.loadTexture('btn_on');
}

// called if the mouse leaves the hexagon
function buttonOff(btn, context) {
	btn.loadTexture('btn_off');	
}

var Game_Over = {

    preload : function() {
        // Load all the needed resources for the menu.
        this.load.image('btn_off', './assets/images/hexagon_blue.png');
        this.load.image('btn_on', './assets/images/hexagon_red.png');
    },

    create : function() {

	// Set a white background
	this.backgroundColor = '#ffffff';

	var won_text = "You won!";
	if(won_state == 1) {
		won_text = "You lost!";
	} else if(won_state == 2) {
		won_text = "Your Opponent quit!";
	}

	// Populate the menu screen with some text
	// and a rotating hexagon as the start button
	var txt = this.add.text(400, 100, won_text);
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
	
	// Add the button and set the over and out functions
        var btn = this.add.button(400, 300, 'btn_off', this.showMenu, this);
	btn.events.onInputOver.add(buttonHover,this);	
	btn.events.onInputOut.add(buttonOff,this);
	btn.anchor.x = .5;
	btn.anchor.y = .5;

	// Add the tweens for the button and the text to animate them
	var tween_btn = this.add.tween(btn);
	tween_btn.to({rotation : 6.28},6000).loop(true);
	tween_btn.start();


	var tween_txt = this.add.tween(txt.scale);
	tween_txt.to({x : 1.5, y : 1.5},2000, Phaser.Easing.Linear.None, true, 0, 9999, true).loop(true);
	tween_txt.start();
    },

    showMenu: function () {
        // Change the state to the menu.
        this.state.start('Menu');
    }

};
