pc.script.create('moveCamera', function (context) {
    
    var flag2 = false;
    var flag3 = false;
    var flag4 = false;
    var flag4down = false;
    
    // Creates a new MoveCamera instance
    var MoveCamera = function (entity) {
        this.entity = entity;
    };

    MoveCamera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            var balls = context.root.findByName("Balls");
            var position = balls.script.controlBalls.selected.getPosition();
            this.entity.setPosition(position.data[0], position.data[1], 22);
        }
    };

    return MoveCamera;
});