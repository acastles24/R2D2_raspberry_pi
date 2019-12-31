const cv = require('opencv4nodejs');
const spawn = require('child_process').spawn
const fs = require('fs')


class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        // todo: move camera out of manual lane nav?
        this.camera = new cv.VideoCapture(0)
        for (let i=0; i<30; i++){
            let _, temp = this.camera.read()
        }
        console.log('Camera initialized')
        this.camera.set(3, 320)
        this.camera.set(4, 240)
    }

    async execute(message){
        let date = ManualLaneNav.get_date()
        let frame_num = 1
        let curr_steer_angle = 0
        let _, image_lane = this.camera.read()
        let image_string = ManualLaneNav.image_to_str(image_lane)
        let new_steering_angle_str = await ManualLaneNav.run_python('./manual_lane_navigation/manual_lane_navigation.py', image_string, date, frame_num.toString())
        this.camera.release()
        let new_steering_angle = parseFloat(new_steering_angle_str)
        let steering_stabilized = ManualLaneNav.stabilize_steering(curr_steer_angle, new_steering_angle)
        console.log(steering_stabilized)
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

static stabilize_steering(current_angle, new_angle){
    let max_change = 5
    if (Math.abs(new_angle - current_angle) > max_change){
        if (new_angle > current_angle){
            return current_angle + max_change
        }
        else{
            return current_angle - max_change
        }
    }
    else{
        return new_angle
    }
}

static get_date(){
    let curr_date = new Date()
    let year = curr_date.getFullYear()
    let month = curr_date.getMonth() + 1
    let day = curr_date.getDate()
    let hours = curr_date.getHours()
    let minutes = curr_date.getMinutes()
    let seconds = curr_date.getSeconds()
    return (year + '_' + month + '_' + day + '_' + hours + '_' + minutes + '_' + seconds)
}

}

exports.ManualLaneNav = ManualLaneNav