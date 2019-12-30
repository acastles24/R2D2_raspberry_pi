const cv = require('opencv4nodejs');
const spawn = require('child_process').spawn
const fs = require('fs')


class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        this.camera = new cv.VideoCapture(0)
        for (let i=0; i<30; i++){
            let _, temp = this.camera.read()
        }
        console.log('Camera initialized')
        this.camera.set(3, 320)
        this.camera.set(4, 240)
        // cv.imwrite('/home/pi/R2D2_raspberry_pi/test_images/test.jpg', image_lane)
    }

    async execute(message){
        let run_num = 1
        let frame_num = 1
        let _, image_lane = this.camera.read()
        cv.imwrite('/home/pi/R2D2_raspberry_pi/test_images/blah.jpg', image_lane)
        let image_string = ManualLaneNav.image_to_str(image_lane)
        const steering_angle = await ManualLaneNav.run_python('./manual_lane_navigation/manual_lane_navigation.py', image_string, run_num.toString(), frame_num.toString())
        this.camera.release()
        console.log(steering_angle)
    }

static run_python(script_name, image, run_num, frame_num){
    return new Promise((resolve, reject) => {
        const process = spawn('python3', [script_name, image, run_num, frame_num])
        const out = []
        process.stdout.on(
            'data',
            (data) => {
                out.push(data.toString())
                console.log(data.toString())
            }
        );
        
        const err = []
        process.stderr.on(
            'data',
            (data) => {
                err.push(data.toString())
                console.log(data.toString() + ' Error')
            }
        );

        process.on('exit', (code, signal)=>{
            if (code === 0) {
                resolve(out)
            }
            else{
                reject(new Error(err.join('\n')))
            }
        })
    })
}

static image_to_str(image){
    let base64Image = cv.imencode('.jpg', image).toString('base64')
    let base64ImageOutput = 'data:image/jpeg;base64,' + base64Image
    return base64ImageOutput
}

}

exports.ManualLaneNav = ManualLaneNav