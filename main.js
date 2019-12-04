const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
const functions = require('./r2d2_functions/functions')
const connect_function = require('./utilities/connect')
const mqtt_connect = require('./utilities/mqtt_connection')


async function main() {
    const r2d2_found = await connect_function.connect(Scanner, R2D2)
    // todo: static ip
    // todo: without wifi?
    
    if (r2d2_found){
        const r2d2_initialized = new functions.r2d2Initialize(r2d2_found, Utils, Stance)
        let mqtt_connection = new mqtt_connect.MQTTConnection('192.168.1.13', r2d2_initialized)
    //     await r2d2_initialized.start_r2d2()
        // await r2d2_initialized.manualRoll(150, 20, [2])
        // await r2d2_initialized.manualRoll(0, 0, [2])
    //     await r2d2_initialized.manualRoll(250, 270, 2000, [2])
    //     await r2d2_initialized.set_stance(2)
    }
}

main()

// await r2d2_initialized.play_animation(3)
// await r2d2_initialized.turn_dome_with_wait(45)
// await r2d2_initialized.set_stance(3);
// await r2d2_initialized.set_stance(2);