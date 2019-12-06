async function handleManualControlRequest(message, r2d2_initialized) {
    let manualRequest = parseManualControlMessage(message)
    let speed = convertVelocityCompToMag(manualRequest.velX, manualRequest.velY)
    let heading = convertJoystickRadtoHeading(manualRequest.ang)
    console.log(speed + ' ' + heading)
    await r2d2_initialized.manualRoll(speed, heading, [2])
}

/**
 * Calculates velocity magnitude from received x and y components.
 * Rounds output to second decimal.
 * @param {float} xvel : x component of velocity
 * @param {float} yvel : y component of velocity
 */
function convertVelocityCompToMag(xvel, yvel){
    vmag = Math.sqrt(Math.pow(xvel, 2) + Math.pow(yvel, 2))
    if (vmag === 0){
        return 0
    }
    else {
        // return (vmag/Math.SQRT2*100 + 150).toString(2)
        return (vmag/70 + 150).toString(2)
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
function convertJoystickRadtoHeading(angle){
    if (angle <= 0) {
        return (angle*-180/3.14).toString(2)
    }
    else {
        return (360-angle*180/3.14).toString(2)
    }
}

/**
 * Parses manual control message from app into velocity X/Y and angular components
 * @param {string} message : ... velX = [float] velY = [float] ang = [float]
 */
function parseManualControlMessage(message){
    messageString = message.toString()
    let velX = messageString.split("velX = ")[1].split(" ")[0]
    let velY = messageString.split("velY = ")[1].split(" ")[0]
    let ang = messageString.split("ang = ")[1]
    return{
        velX: velX,
        velY: velY,
        ang: ang,
    }
}

module.exports.handleManualControlRequest = handleManualControlRequest