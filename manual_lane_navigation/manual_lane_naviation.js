const cv = require('opencv4nodejs');

class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        this.camera = new cv.VideoCapture(0)
        this.camera.set(3, 320)
        this.camera.set(4, 240)
    }

    async execute(message){
        
    }
}

exports.ManualLaneNav = ManualLaneNav