// Create our 'main' state that will contain the game
var mainState = {
    preload: function () {
        // This function is called after the preload function.
        // That's where we load the images and sounds.
        // First, load the bird sprite
        game.load.image('bird', 'assets/rocketsmall.png');
        game.load.image('jump', 'assets/rocketsmall.png');

        //Then, the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
    },

    create: function () {
        // This function is called after the preload function.
        // Here we set up the game, display sprites, etc.
        // First, change the background color of the game to blue:
        game.stage.backgroundColor = '#111111';

        // Then, set the physics system:
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall:
        this.bird.body.gravity.y = 900;

        // Call the 'jump' function when the spacekey is hit:
        var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacekey.onDown.add(this.jump, this);

        // Create an empty group for the pipes
        this.pipes = game.add.group();

        // Add pipes into the game once every 1,5 secs
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Score system
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "24px Courier bold", fill: "#ffffff"});
    },

    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y:
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group:
        this.pipes.add(pipe);

        // Enable physics on the pipe:
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left:
        pipe.body.velocity.x = -150;

        // Automatically kill the pipe when it is no longer visible:
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position.
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes with one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i< 8; i++)
        if (i != hole && i != hole + 1 && i != hole + 2)
        this.addOnePipe(640, i * 60 + 10);

        // Increase the score by 1
        this.score += 1;
        this.labelScore.text = "Laser gates escaped: " + this.score;
    },

    update: function () {
        // This function is called 60 times per second.
        // It contains the game's logic.

        // If the bird is out of the screen (too high or too low), call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490) this.restartGame();

        // If the bird collides with pipes, call restart game:
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        // Rotate bird
        if (this.bird.angle < 20) this.bird.angle += 1;
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen.
        if (this.bird.alive == false) return;
        
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing.
        game.time.events.remove(this.timer);

        // Go through all the pipes and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    // Make the bird jump:
    jump: function () {
        if (this.bird.alive == false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -200;

        // Create an animation on the bird:
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20 deg. in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation:
        animation.start();

        // To make the animation more authentic, move the anchor to the left and downward:
        this.bird.anchor.setTo(-0.1, 0.3);
    },

    // Restart the game:
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Initialize Phaser and create a 400px by 490px game
var game = new Phaser.Game(640, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game.
game.state.start('main');