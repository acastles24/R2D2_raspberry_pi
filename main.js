const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
const functions = require('./r2d2_functions/functions')

class CreateRobot{
    constructor(){
        r2d2_connected = this.connect(Scanner, R2D2);
        r2d2_functions = new functions.r2d2Functions(r2d2_connected, Utils, Stance)

    }


    /**
 * Connects to R2-D2
 * @param {Scanner from spherov2} scanner 
 * @param {R2-D2 type from spherov2} scanner 
 * @returns {Connected R2-D2 instance}
 * todo: retry if connection failed
 */
async connect(scanner, R2D2) {
    const r2d2_connected = await scanner.find(R2D2.advertisement);
    return r2d2_connected
  }
}


async function main() {
    r2d2 = CreateRobot()
    // todo: static ip
    // todo: without wifi?
    const r2d2_initialized = new functions.r2d2Initialize(r2d2_found, Utils, Stance)
    let mqtt_connection = new mqtt_connect.MQTTConnection('192.168.1.13', r2d2_initialized)
}

main()

// await r2d2_initialized.play_animation(3)
// await r2d2_initialized.turn_dome_with_wait(45)
// await r2d2_initialized.set_stance(3);
// await r2d2_initialized.set_stance(2);