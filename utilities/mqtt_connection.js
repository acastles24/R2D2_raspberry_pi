const mqtt = require('mqtt')
const {handleManualControlRequest} = require('../r2d2_functions/move_functions')

class MQTTConnection{
    constructor(ip_address, r2d2_initialized){
        console.log('Connecting to ' + ip_address)
        this.client = mqtt.connect('mqtt://' + ip_address)
        console.log('Connected!')
        this.r2d2_initialized = r2d2_initialized
        this.drive_method = null

        this.drive_method_message_dict

        this.client.on('connect', () => {
            this.client.subscribe('rpi/chooseDriveMethod')
          })
        
        this.client.on('message', (topic, message) => {
        console.log('received message %s %s', topic, message)
        switch (topic) {
            case 'rpi/manualControl':
                return handleManualControlRequest(message, this.r2d2_initialized)
            case 'rpi/chooseDriveMethod':
                this.drive_method = message
        }
        })
}
}

exports.MQTTConnection = MQTTConnection