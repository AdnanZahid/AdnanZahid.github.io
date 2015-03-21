pc.script.create('reset', function (context) {
    
    var zeroVec = pc.Vec3.ZERO;
    
    // Creates a new Reset instance
    var Reset = function (entity) {
        this.entity = entity;
    };

    Reset.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // this.position = this.entity.getPosition();
            // this.rotation = this.entity.getRotation();
            
            this.position = this.entity.getPosition().clone();
            this.rotation = this.entity.getRotation().clone();
            
            this.mass = this.entity.rigidbody.mass;
            this.friction = this.entity.rigidbody.friction;
            this.script = this.entity.script;
            this.name = this.entity.name;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            if (context.keyboard.wasPressed(pc.input.KEY_R)) {
                
                this.entity.setPosition(this.position);
                this.entity.setRotation(this.rotation);
                
                this.entity.rigidbody.mass = this.mass;
                this.entity.rigidbody.friction = this.friction;
                this.entity.script = this.script;
                this.entity.name = this.name;

                this.entity.rigidbody.linearVelocity = zeroVec;
                this.entity.rigidbody.angularVelocity = zeroVec;
            
                this.entity.rigidbody.syncEntityToBody();
            }
        }
    };

    return Reset;
});