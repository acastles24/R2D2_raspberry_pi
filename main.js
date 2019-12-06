const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
const {r2d2Functions} = require('./r2d2_functions/move_functions')
const {MQTTConnection} = require('./utilities/mqtt_connection')

class CreateRobot{
    constructor(){
        r2d2_connected = connect(Scanner, R2D2);
        this.r2d2_functions = new r2d2Functions(r2d2_connected, Utils, Stance)
        this.client = new MQTTConnection('192.168.1.13', r2d2_functions)
}
}

function subscribeDriveMethod(topic) {
    this.client.subscribe(topic)
}

function unsubscribeDriveMethod(topic){
    this.client.unsubscribe(topic)
}


/**
 * Connects to R2-D2
 * @param {Scanner from spherov2} scanner 
 * @param {R2-D2 type from spherov2} scanner 
 * @returns {Connected R2-D2 instance}
 * todo: retry if connection failed
 */
async function connect(scanner, R2D2) {
    const r2d2_connected = await scanner.find(R2D2.advertisement);
    return r2d2_connected
}


function main() {
    r2d2 = CreateRobot()
    // todo: static ip
    // todo: without wifi?
    // todo: incorporate into app
    current_drive_method = null
    drive_method_received = this.r2d2.drive_method
    while (true){
        if (current_drive_method !== drive_method_received){
            if (current_drive_method){
                unsubscribeDriveMethod(current_drive_method)
            }
            subscribeDriveMethod(drive_method_received)
        }      
    }
}

main()

// await r2d2_initialized.play_animation(3)
// await r2d2_initialized.turn_dome_with_wait(45)
// await r2d2_initialized.set_stance(3);
// await r2d2_initialized.set_stance(2);