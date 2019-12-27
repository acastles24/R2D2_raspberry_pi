const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js')
const {r2d2Functions} = require('./r2d2_functions/move_functions')
const {MQTTConnection} = require('./utilities/mqtt_connection')
const {ManualControl} = require('./r2d2_functions/manual_drive')
const {ManualLaneNav} = require('./manual_lane_navigation/manual_lane_naviation')
// const {cv} = require('opencv')

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


async function main() {
    r2d2_connected = await connect(Scanner, R2D2);
    r2d2_functions = new r2d2Functions(r2d2_connected, Utils, Stance)
    await r2d2_functions.resetHeading()
    await r2d2_functions.set_stance(3)

    ManualControlInitialized = new ManualControl(r2d2_functions)

    ManualLaneNavInitialized = new ManualLaneNav(r2d2_functions)

    const driveModeExecuteDict = {
        'rpi/manualControl': ManualControlInitialized
    }

    client_connected = new MQTTConnection('192.168.1.13', driveModeExecuteDict)
    
    // todo: static ip
    // todo: without wifi?
    // todo: incorporate into app


}

main()

// await r2d2_initialized.play_animation(3)
// await r2d2_initialized.turn_dome_with_wait(45)
// await r2d2_initialized.set_stance(3);
// await r2d2_initialized.set_stance(2);