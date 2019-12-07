const mqtt = require('mqtt')
const {handleManualControlRequest} = require('../r2d2_functions/move_functions')

class MQTTConnection{
    constructor(ip_address, driveModeExecuteDict){
        console.log('Connecting to ' + ip_address)
        this.client = mqtt.connect('mqtt://' + ip_address)
        console.log('Connected!')

        this.client.on('connect', () => {
            this.client.subscribe('rpi/chooseDriveMethod')
            subscribeToMethodsinDict(driveModeExecuteDict)
          })
        
        this.client.on('message', (topic, message) => {
        console.log('received message %s %s', topic, message)
        driveModeExecuteDict.topic.execute(message)
        
        })
}
}

function subscribeToMethodsinDict(dict_){
    for (method in dict_){
        this.client.subscribe(method)
    }
}

exports.MQTTConnection = MQTTConnection