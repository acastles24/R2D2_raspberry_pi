const cv = require('opencv4nodejs');
const {PythonShell} = require('python-shell')
const fs = require('fs')

const SPEED = 220

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
        this.active = false
        this.shell = new PythonShell('./manual_lane_navigation/manual_lane_navigation.py')
    }

    async execute(message){
        if (message === 'GO'){
            this.active = true
            this.start_lane_nav()
        }
        else if (message === 'STOP'){
            this.active = false
        }
    }

async start_lane_nav(){
    var date = ManualLaneNav.get_date()
    var curr_steer_angle = 0
    var frame_num = 1
    while (this.active === true){
        var starttime = new Date();
        let _, image_lane = this.camera.read()
        let image_string = ManualLaneNav.image_to_str(image_lane)
        let new_steering_angle_str = await this.run_python(image_string, date, frame_num.toString())
        
        let new_steering_angle = parseFloat(new_steering_angle_str)
        if (new_steering_angle === -1000){
            this.active = false
            this.r2d2_functions.manualRoll(0, new_angle_converted, [2])
            console.log('No more lanes detected')
            continue
        }

        let steering_stabilized = ManualLaneNav.stabilize_steering(curr_steer_angle, new_steering_angle)

        var new_angle_converted = ManualLaneNav.convert_steering_angle(steering_stabilized)
        
        console.log(new_angle_converted + ' Steering Angle Calculated in Frame ' + frame_num)

        this.r2d2_functions.resetHeading()
        this.r2d2_functions.manualRoll(SPEED, new_angle_converted, [2])

        curr_steer_angle = steering_stabilized
        frame_num = frame_num + 1
    }
    await this.r2d2_functions.manualRoll(0, new_angle_converted, [2])
}

run_python(image, date, frame_num){
    return new Promise((resolve) => {
        const out = []
        this.shell.on('message', function (message) {
            out.push(message)
            resolve(out)
          })
        this.shell.send(image + ' ' + date + ' ' + frame_num)
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

static convert_steering_angle(angle){
    if (angle < 0){
        return 360 + angle
    }
    else{
        return angle
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