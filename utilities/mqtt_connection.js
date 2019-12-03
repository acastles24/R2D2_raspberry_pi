const mqtt = require('mqtt')

exports.mqtt_connect = function(ip_address) {
    console.log('Connecting to ' + ip_address)
    const client = mqtt.connect('mqtt://' + ip_address)
    console.log('Connected!')
    client.on('connect', () => {
        client.subscribe('rpi/manualControl')
      })

    client.on('message', (topic, message) => {
    console.log('received message %s %s', topic, message)
    switch (topic) {
        case 'rpi/manualControl':
        return handleManualControlRequest(message)
    }
    })
}

async function handleManualControlRequest(message, r2d2_initialized) {
    let manualRequest = parseManualControlRequest(message)
    let speed = convertVelocitytoMaxMinBounds(manualRequest.velX, manualRequest.velY)
    let heading = convertRadtoHeading(manualRequest.ang)
    console.log(speed + ' ' + heading)
    // todo: what latency?
    await r2d2_initialized.manualRoll(speed, heading, 100, [2])
}

function convertVelocitytoMaxMinBounds(xvel, yvel){
    vmag = Math.sqrt(Math.pow(xvel, 2) + Math.pow(yvel, 2))
    // todo: round
    return vmag*2 + 150
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