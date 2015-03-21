pc.script.create('constraintStart', function (context) {
    
    var zeroVec = pc.Vec3.ZERO;
    
    // Creates a new Constraint4 instance
    var Constraint4 = function (entity) {
        this.entity = entity;
    };

    Constraint4.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var ballStart = context.root.findByName('Ball Start');
            var position = ballStart.getPosition();
            var x = position.data[0];
            var y = position.data[1];
            if(x > -12.1) {

                ballStart.rigidbody.linearVelocity = zeroVec;
                ballStart.rigidbody.angularVelocity = zeroVec;
            
                ballStart.rigidbody.syncEntityToBody();
            }
        }
    };

    return Constraint4;
});