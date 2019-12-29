const cv = require('opencv4nodejs');
const spawn = require('child_process').spawn


class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        this.camera = new cv.VideoCapture(0)
        this.camera.set(3, 320)
        this.camera.set(4, 240)
        let image_lane = this.camera.read()
        run_python('./manual_lane_navigation/manual_lane_navigation.py')
        // cv.imwrite('/home/pi/R2D2_raspberry_pi/test_images/test.jpg', image_lane)
    }

    async execute(message){
        let image_lane = this.camera.read()
        let python_process = spawn('python', ['manual_lane_navigation.py', image_lane])
        python_process.stdout.on('data', (data) => {
            console.log(data.toString())
        })
    }
}


function run_python(script_name, arg){
    return new Promise((resolve, reject) => {
        const process = spawn('python', [script_name, arg])
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
            resolve(out)
        }
    }
}

exports.ManualLaneNav = ManualLaneNav