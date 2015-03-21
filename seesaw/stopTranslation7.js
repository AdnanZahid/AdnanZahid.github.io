pc.script.create('stopTranslation7', function (context) {
    // Creates a new StopTranslation instance
    var StopTranslation = function (entity) {
        this.entity = entity;
    };

    StopTranslation.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            var position = this.entity.getPosition();
            this.entity.setPosition(19, position.data[1], 0);
            
            this.entity.rigidbody.syncEntityToBody();
        }
    };

    return StopTranslation;
});