const mqtt = require('mqtt')

class MQTTConnection{
    constructor(ip_address, r2d2_initialized){
        console.log('Connecting to ' + ip_address)
        this.client = mqtt.connect('mqtt://' + ip_address)
        console.log('Connected!')
        this.r2d2_initialized = r2d2_initialized
        // todo: refactor
        this.client.on('connect', () => {
            this.client.subscribe('rpi/manualControl')
          })
    
        this.client.on('message', (topic, message) => {
        console.log('received message %s %s', topic, message)
        switch (topic) {
            case 'rpi/manualControl':
            return handleManualControlRequest(message, this.r2d2_initialized)
        }
        })
}
}

exports.MQTTConnection = MQTTConnection

function handleManualControlRequest(message, r2d2_initialized) {
    let manualRequest = parseManualControlRequest(message)
    let speed = convertVelocitytoMaxMinBounds(manualRequest.velX, manualRequest.velY)
    let heading = convertRadtoHeading(manualRequest.ang)
    console.log(speed + ' ' + heading)
    // todo: what latency?
    // r2d2_initialized.manualRoll(speed, heading, [2])
}

function convertVelocitytoMaxMinBounds(xvel, yvel){
    vmag = Math.sqrt(Math.pow(xvel, 2) + Math.pow(yvel, 2))
    // todo: round
    if (vmag === 0){
        return 0
    }
    else {
        return vmag/70.71*100 + 150
    }
    
}

function convertRadtoHeading(angle){
    // todo: round
    if (angle <= 0) {
        return angle*-180/3.14
    }
    else {
        return 360-angle*180/3.14
    }
}

function parseManualControlRequest(message){
    messageString = message.toString()
    let velX = messageString.split("velX = ")[1].split(" ")[0]
    let velY = messageString.split("velY = ")[1].split(" ")[0]
    let ang = messageString.split("ang = ")[1]
    console.log(velX + velY + ang)
    return{
        velX: velX,
        velY: velY,
        ang: ang,
    }
}