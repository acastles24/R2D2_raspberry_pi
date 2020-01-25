const cv = require('opencv4nodejs');
const {PythonShell} = require('python-shell')
const fs = require('fs')

const SPEED = 200

class ManualLaneNav{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
        this.camera = new cv.VideoCapture(0)
        // camera takes a few frames to adjust to lighting
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
    await this.r2d2_functions.resetHeading()
    var curr_steer_angle = 0
    var curr_steer_angle_converted = 0
    var frame_num = 1
    while (this.active === true){
        
        let _, image_lane = this.camera.read()
        let image_string = ManualLaneNav.image_to_str(image_lane)
        
        var starttime = new Date();
        let new_steering_angle_str = await this.run_python(image_string, date, frame_num.toString())
        var endtime = new Date()
        // console.log(endtime - starttime)
        let new_steering_angle = parseFloat(new_steering_angle_str)
        if (new_steering_angle === -1000){
            this.active = false
            await this.r2d2_functions.manualRoll(0, new_angle_converted, [2])
            console.log('No more lanes detected')
            continue
        }

        if (frame_num > 1){
            let steering_stabilized = ManualLaneNav.stabilize_steering(curr_steer_angle, new_steering_angle)
            let delta = steering_stabilized - curr_steer_angle
            console.log(steering_stabilized)
            var new_angle_converted = ManualLaneNav.convert_steering_angle(steering_stabilized, curr_steer_angle_converted)

            console.log(new_angle_converted + ' Steering Angle Calculated in Frame ' + frame_num)

            await this.r2d2_functions.manualRoll(SPEED, new_angle_converted, [2])

            curr_steer_angle = steering_stabilized
            curr_steer_angle_converted = new_angle_converted
        }
        frame_num = frame_num + 1
    }
    await this.r2d2_functions.manualRoll(0, new_angle_converted, [2])
}

run_python(image, date, frame_num){
    return new Promise((resolve) => {
        let out = []
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

static convert_steering_angle(delta, curr_angle){
    const new_angle = curr_angle + delta
    if (new_angle < 0){
        return 360 + new_angle
    }
    else if (new_angle >= 360){
        return new_angle - 360
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