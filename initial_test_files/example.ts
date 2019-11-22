const { Scanner, Utils, R2D2 } = require('spherov2.js');

const WAIT_TIME = 2000;

async function run() {
    const r2d2 = await Scanner.find(R2D2.advertisement, "D2-609B");
    await r2d2.wake();
    await r2d2.turnDome(90);
    await Utils.wait(WAIT_TIME);
    await r2d2.turnDome(-90);
    // await Utils.wait(WAIT_TIME);
    // await r2d2.playAnimation(2);
    // await Utils.wait(WAIT_TIME);
    // await r2d2.playAudioFile(4);
    // await Utils.wait(WAIT_TIME);
    // await r2d2.playAnimation(5);

};

run();
