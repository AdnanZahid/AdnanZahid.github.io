pc.script.create("trigger2", function (context) {

    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        initialize: function () {
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        },

        onCollisionStart: function (result) {
            
            if (result.other.rigidbody.entity.name === "Ball 2") {
                var balls = context.root.findByName('Balls');
                balls.script.send('controlBalls', 'changeBall', 3);
            }
        }
    };

    return Trigger;
});