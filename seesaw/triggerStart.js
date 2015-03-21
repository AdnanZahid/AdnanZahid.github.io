pc.script.create("triggerStart", function (context) {

    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        initialize: function () {
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
            
            this.turn = 0;
        },

        onCollisionStart: function (result) {
            
            if (result.other.rigidbody.entity.name === "Ball 9") {
                
                this.turn ++ ;
                
                var ballStart = context.root.findByName("Ball Start");
                var ball1 = context.root.findByName("Ball 1");
                var ball2 = context.root.findByName("Ball 2");
                var ball3 = context.root.findByName("Ball 3");
                var ball4 = context.root.findByName("Ball 4");
                var ball5 = context.root.findByName("Ball 5");
                var ball6 = context.root.findByName("Ball 6");
                var ball7 = context.root.findByName("Ball 7");
                var ball8 = context.root.findByName("Ball 8");
                var ball9 = context.root.findByName("Ball 9");
                
                ball1.rigidbody.applyImpulse(-1500, 0, 0);
                ball2.rigidbody.applyImpulse(-750, 0, 0);
                ball3.rigidbody.applyImpulse(-375, 0, 0);
                ball5.rigidbody.applyImpulse(1500, 0, 0);
                ball6.rigidbody.applyImpulse(750, 0, 0);
                ball7.rigidbody.applyImpulse(375, 0, 0);
                ball8.rigidbody.applyImpulse(187.5, 0, 0);
                
                var ballStartMass = ballStart.rigidbody.mass;
                
                ballStart.rigidbody.mass = ball1.rigidbody.mass;
                ball1.rigidbody.mass = ball2.rigidbody.mass;
                ball2.rigidbody.mass = ball3.rigidbody.mass;
                ball3.rigidbody.mass = ball4.rigidbody.mass;
                ball4.rigidbody.mass = ball5.rigidbody.mass;
                ball5.rigidbody.mass = ball6.rigidbody.mass;
                ball6.rigidbody.mass = ball7.rigidbody.mass;
                ball7.rigidbody.mass = ball8.rigidbody.mass;
                ball8.rigidbody.mass = ball9.rigidbody.mass;
                ball9.rigidbody.mass = ballStartMass;
                
                var ballStartFriction = ballStart.rigidbody.friction;
                
                ballStart.rigidbody.friction = ball1.rigidbody.friction;
                ball1.rigidbody.friction = ball2.rigidbody.friction;
                ball2.rigidbody.friction = ball3.rigidbody.friction;
                ball3.rigidbody.friction = ball4.rigidbody.friction;
                ball4.rigidbody.friction = ball5.rigidbody.friction;
                ball5.rigidbody.friction = ball6.rigidbody.friction;
                ball6.rigidbody.friction = ball7.rigidbody.friction;
                ball7.rigidbody.friction = ball8.rigidbody.friction;
                ball8.rigidbody.friction = ball9.rigidbody.friction;
                ball9.rigidbody.friction = ballStartFriction;
                
                var ballStartName = ballStart.name;
                
                ballStart.name = ball1.name;
                ball1.name = ball2.name;
                ball2.name = ball3.name;
                ball3.name = ball4.name;
                ball4.name = ball5.name;
                ball5.name = ball6.name;
                ball6.name = ball7.name;
                ball7.name = ball8.name;
                ball8.name = ball9.name;
                ball9.name = ballStartName;
                
                var balls = context.root.findByName('Balls');
                balls.script.send('controlBalls', 'changeBall', 1);
            }
        }
    };

    return Trigger;
});