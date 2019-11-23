const { Scanner, Stance, Utils, R2D2 } = require('spherov2.js');
let connect_function = require('./utilities/connect')
const WAIT_TIME = 7000;

async function main() {
    const r2d2 = await connect_function.connect(Scanner, R2D2)
    if (r2d2){
        // await r2d2.configureSensorStream();
        await r2d2.setStance(Stance.tripod);
        await Utils.wait(2000);
        await r2d2.playAnimation(20);
        await r2d2.turnDome(20)
        await r2d2.playAudioFile(2);
        await Utils.wait(10000);
        await r2d2.setStance(Stance.tripod);
    }
    else{
        console.log('not found')
    }
}

main()