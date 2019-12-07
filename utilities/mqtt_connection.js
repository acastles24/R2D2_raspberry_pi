const mqtt = require('mqtt')

class MQTTConnection{
    constructor(ip_address, driveModeExecuteDict){
        console.log('Connecting to ' + ip_address)
        this.client = mqtt.connect('mqtt://' + ip_address)
        console.log('Connected!')

        this.client.on('connect', () => {
            subscribeToMethodsinDict(driveModeExecuteDict, this.client)
          })
        
        this.client.on('message', (topic, message) => {
        console.log('received message %s %s', topic, message)
        driveModeExecuteDict[topic].execute(message)
        
        })
}
}

function subscribeToMethodsinDict(dict_, client){
    for (method in dict_){
        client.subscribe(method)
    }
}

exports.MQTTConnection = MQTTConnection