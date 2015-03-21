pc.script.create('constraint4', function (context) {
    
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
            var ball4 = context.root.findByName('Ball 4');
            var position = ball4.getPosition();
            var x = position.data[0];
            var y = position.data[1];
            if(x > 23.75) {

                ball4.rigidbody.linearVelocity = zeroVec;
                ball4.rigidbody.angularVelocity = zeroVec;
            
                ball4.rigidbody.syncEntityToBody();
            }
        }
    };

    return Constraint4;
});