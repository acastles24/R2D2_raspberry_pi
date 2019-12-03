const mqtt = require('mqtt')

exports.mqtt_connect = function(ip_address) {
    console.log('Connecting to ' + ip_address)
    const client = mqtt.connect('mqtt://' + ip_address)
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

function handleManualControlRequest(message, r2d2_initialized) {
    console.log(message)
}
