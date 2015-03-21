// attribute for editor
pc.script.attribute('barName', 'string', '', {
    displayName: "Bar Name"
});

pc.script.create('joint', function (context) {
    // Creates a new Joint instance
    var Joint = function (entity) {
        this.entity = entity;
    };

    Joint.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.box1 = this.entity;
            this.box2 = context.root.findByName(this.barName);
            
            // might be not found
            if (! this.box2) return;

            // Create a joint between box1 and box2
            // Note this uses the Ammo API directly
            var pivot1 = new Ammo.btVector3(0.15, 0.15, 0);
            var pivot2 = new Ammo.btVector3(0, -0.15, 0);
            var joint = new Ammo.btPoint2PointConstraint(this.box1.rigidbody.body, this.box2.rigidbody.body, pivot1, pivot2);
            
            context.systems.rigidbody.dynamicsWorld.addConstraint(joint);
        },
        

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            // box 2 might be not found
            if (! this.box2) return;
            // If the body is moving very slowly it may be deactivated
            // For this example we want to keep it activated all the time
            this.box2.rigidbody.activate();
        }
    };

    return Joint;
});