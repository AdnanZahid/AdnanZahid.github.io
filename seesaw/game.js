pc.script.create('game', function (context) {
    
    var gameOver = false;
    var score = 0;
    
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Game;
});