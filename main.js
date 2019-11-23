const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
let connect_function = require('./utilities/connect')
const WAIT_TIME = 7000;

async function main() {
    const r2d2 = await connect_function.connect(Scanner, R2D2)
    if (r2d2){
        await r2d2.playAnimation(3);
        await Utils.wait(WAIT_TIME);
        await r2d2.turnDome(180);
        await Utils.wait(3000);
        await r2d2.setStance(Stance.tripod);
        return 
    }
}

main()