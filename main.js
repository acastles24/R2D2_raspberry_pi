const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
const startup = require('./r2d2_functions/startup')
const functions = require('./r2d2_functions/functions')
const connect_function = require('./utilities/connect')

async function main() {
    const r2d2 = await connect_function.connect(Scanner, R2D2)
    if (r2d2){
        const r2d2_initialized = new functions.r2d2Initialize(r2d2, Scanner, Utils, Stance)
        await r2d2_initialized.start_r2d2()
        await r2d2_initialized.play_animation(3)
        await r2d2_initialized.turn_dome_with_wait(45)
        await r2d2_initialized.set_stance(3);
        await r2d2_initialized.set_stance(2);
    }
}

main()