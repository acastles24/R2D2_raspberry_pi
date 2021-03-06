const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js')
const {r2d2Functions} = require('./r2d2_functions/move_functions')
const {MQTTConnection} = require('./utilities/mqtt_connection')
const {ManualControl} = require('./r2d2_functions/manual_drive')
const {ManualLaneNav} = require('./manual_lane_navigation/manual_lane_naviation')

/**
 * Connects to R2-D2
 * @param {Scanner from spherov2} scanner 
 * @param {R2-D2 type from spherov2} R2D2 
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
    if (!r2d2_functions.r2d2_found){
        console.log('Robot not found')
        return
    }
    await r2d2_functions.resetHeading()
    await r2d2_functions.set_stance(3)

    ManualControlInitialized = await new ManualControl(r2d2_functions)

    ManualLaneNavInitialized = await new ManualLaneNav(r2d2_functions)

    const driveModeExecuteDict = {
        'rpi/manualControl': ManualControlInitialized,
        'rpi/laneNav': ManualLaneNavInitialized
    }

    client_connected = await new MQTTConnection('192.168.1.13', driveModeExecuteDict)

    ManualLaneNavInitialized.execute('GO')
    
    // todo: static ip
    // todo: without wifi?
    // todo: incorporate into app


}

main()