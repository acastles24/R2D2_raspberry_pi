const { Scanner, Stance, Utils, R2D2, DriveFlag } = require('spherov2.js');
const functions = require('./r2d2_functions/functions')
const connect_function = require('./utilities/connect')
const types = require('./node_modules/spherov2.js/dist/')

async function main() {
    const r2d2_found = await connect_function.connect(Scanner, R2D2)
    if (r2d2_found){
        const r2d2_initialized = new functions.r2d2Initialize(r2d2_found, Scanner, Utils, Stance)
        await r2d2_initialized.start_r2d2()
        await r2d2_found.rollTime(150, 0, 3000, [2])
        await r2d2_found.rollTime(250, 90, 2000, [2])
        await r2d2_found.rollTime(250, 270, 2000, [2])
    }
}

main()

// await r2d2_initialized.play_animation(3)
// await r2d2_initialized.turn_dome_with_wait(45)
// await r2d2_initialized.set_stance(3);
// await r2d2_initialized.set_stance(2);