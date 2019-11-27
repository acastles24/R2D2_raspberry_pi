exports.mqtt_connect = function(mqtt, ip_address) {
    console.log('Connecting to ' + ip_address)
    const client = mqtt.connect('mqtt://' + ip_address)
    client.on('connect', () => {
        client.subscribe('rpi/manual_fwd')
        client.subscribe('rpi/manual_back')
        client.subscribe('rpi/manual_turn')
      })

    client.on('message', (topic, message) => {
    console.log('received message %s %s', topic, message)
    switch (topic) {
        case 'rpi/manual_fwd':
        return handleFWDRequest(message)
        case 'rpi/manual_back':
        return handleBackRequest(message)
        case 'rpi/manual_turn':
        return handleTurnRequest(message)
    }
    })
}

function handleFWDRequest(message, r2d2) {
    if message == 'fwd'{
        // todo: vary speed
        r2d2.speed += 200
    }
}