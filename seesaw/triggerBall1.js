pc.script.create("triggerBall1", function (context) {

    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        initialize: function () {
            context.root.findByName('Ball 1').collision.on('collisionstart', this.onCollisionStart, this);
        },

        onCollisionStart: function (result) {
            
            if (result.other.rigidbody.entity.name === "Ball Start") {
                var balls = context.root.findByName('Balls');
                balls.script.send('controlBalls', 'changeBall', 1);
            }
        }
    };

    return Trigger;
});