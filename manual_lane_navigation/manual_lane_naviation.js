const cv = require('opencv4nodejs');

class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        this.camera = new cv.VideoCapture(0)
        this.camera.set(3, 320)
        this.camera.set(4, 240)
        let image_lane = this.camera.read()
        console.log(image_lane)
        cv.imwrite('/home/pi/R2D2_raspberry_pi/test_images/test.jpg', image_lane)
    }

    async execute(message){
        _, image_lane = this.camera.read()
        cv.imshow(image_lane)
    }
}

exports.ManualLaneNav = ManualLaneNav