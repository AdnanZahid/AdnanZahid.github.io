pc.script.create('carryUp', function (context) {
    
    // Creates a new CarryUp instance
    var CarryUp = function (entity) {
        this.entity = entity;
    };

    CarryUp.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
            this.entity.collision.on('collisionend', this.onCollisionEnd, this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },

        onCollisionStart: function (result) {
            
            if (result.other.rigidbody.entity.name === "Ball 9") {
                this.entity.rigidbody.applyImpulse(0, 750, 0);
            }
        },

        onCollisionEnd: function (other) {
            
            if (other.rigidbody.entity.name === "Ball 9") {
                this.entity.rigidbody.applyImpulse(0, -250, 0);
            }
        }
    };

    return CarryUp;
});