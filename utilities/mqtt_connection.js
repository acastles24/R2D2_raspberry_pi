exports.mqtt_connect = function(mqtt, ip_address) {
    console.log('Connecting to ' + ip_address)
    const client = mqtt.connect('mqtt://' + ip_address)
    client.on('connect', () => {
        client.subscribe('rpi/manual_fwd')
        client.subscribe('rpi/manual_back')
        client.subscribe('rpi/manual_turn')
      })
}

