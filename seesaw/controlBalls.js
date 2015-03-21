pc.script.create('controlBalls', function (context) {
    
    // Creates a new ControlBalls instance
    var ControlBalls = function (entity) {
        this.entity = entity;
    };

    ControlBalls.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            this.balls = [
                context.root.findByName("Ball Start"),
                context.root.findByName("Ball 1"),
                context.root.findByName("Ball 2"),
                context.root.findByName("Ball 3"),
                context.root.findByName("Ball 4"),
                context.root.findByName("Ball 5"),
                context.root.findByName("Ball 6"),
                context.root.findByName("Ball 7"),
                context.root.findByName("Ball 8"),
                context.root.findByName("Ball 9")
            ];
            this.selectedIndex = 0;
            this.selected = this.balls[this.selectedIndex];
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            this.balls = [
                context.root.findByName("Ball Start"),
                context.root.findByName("Ball 1"),
                context.root.findByName("Ball 2"),
                context.root.findByName("Ball 3"),
                context.root.findByName("Ball 4"),
                context.root.findByName("Ball 5"),
                context.root.findByName("Ball 6"),
                context.root.findByName("Ball 7"),
                context.root.findByName("Ball 8"),
                context.root.findByName("Ball 9")
            ];
            this.selected = this.balls[this.selectedIndex];
            
            if (context.keyboard.wasPressed(pc.input.KEY_R)) {
                // this.selectedIndex = context.root.findByName("Trigger wall").script.triggerStart.turn;
                this.selectedIndex = 0;
                this.selected = this.balls[this.selectedIndex];
            }
            
            if (context.keyboard.isPressed(pc.input.KEY_LEFT) ) {
                this.selected.rigidbody.applyImpulse(-6, 0, 0);
            }
            if (context.keyboard.isPressed(pc.input.KEY_RIGHT) ) {
                this.selected.rigidbody.applyImpulse(6, 0, 0);
            }
        },
        
        changeBall: function (number) {
            
            this.selectedIndex = number;
            this.selected = this.balls[this.selectedIndex];
            // this.selected = this.balls[this.selectedIndex + context.root.findByName("Trigger wall").script.triggerStart.turn];
        }
    };

    return ControlBalls;
});