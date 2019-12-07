class ManualControl{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
    }

    async execute(message){
        let manualRequest = ManualControl.parseManualControlMessage(message)
        let speed = ManualControl.convertVelocityCompToMag(manualRequest.velX, manualRequest.velY)
        let heading = ManualControl.convertJoystickRadtoHeading(manualRequest.ang)
        console.log(speed + ' ' + heading)
        await this.r2d2_functions.manualRoll(speed, heading, [2])
    }

    /**
 * Calculates velocity magnitude from received x and y components.
 * Rounds output to second decimal.
 * @param {float} xvel : x component of velocity
 * @param {float} yvel : y component of velocity
 */
static convertVelocityCompToMag(xvel, yvel){
    let vmag = Math.sqrt(Math.pow(xvel, 2) + Math.pow(yvel, 2))
    if (vmag === 0){
        return 0
    }
    else {
        return (vmag/Math.SQRT2*100 + 150)
    }
    
}

/**
 * Converts joystick angle in radians to heading in degrees CW.
 * 0 rad -> 0 deg
 * -1.57 rad -> 90 deg
 * 3.14 rad -> 180 deg
 * 1.57 rad -> 270 deg
 * @param {float} angle : angle of joystick in radians.
 */
static convertJoystickRadtoHeading(angle){
    if (angle <= 0) {
        return (angle*(-180/3.14))
    }
    else {
        return (360-angle*180/3.14)
    }
}

/**
 * Parses manual control message from app into velocity X/Y and angular components
 * @param {string} message : ... velX = [float] velY = [float] ang = [float]
 */
static parseManualControlMessage(message){
    let messageString = message.toString()
    let velX = messageString.split("velX = ")[1].split(" ")[0]
    let velY = messageString.split("velY = ")[1].split(" ")[0]
    let ang = messageString.split("ang = ")[1]
    return{
        velX: velX,
        velY: velY,
        ang: ang,
    }
}
}

exports.ManualControl = ManualControl