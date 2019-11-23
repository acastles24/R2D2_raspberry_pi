const { Scanner, Utils, R2D2 } = require('spherov2.js');

const WAIT_TIME = 2000;

async function connect(robot) {
    const r2d2 = await Scanner.find(robot.advertisement);
    if (r2d2){
        await r2d2.turnDome(90);
        await Utils.wait(WAIT_TIME);
        await r2d2.turnDome(-90);
    }
    return r2d2
}

let r2d2_connected = connect(R2D2)
