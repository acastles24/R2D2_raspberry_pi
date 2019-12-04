/**Class for R2-D2 functions after robot is found via Bluetooth.*/

class r2d2Functions{
    /**
     * 
     * @param {R2D2 robot found} r2d2_found 
     * @param {Utilies from spherov2} utils 
     * @param {Stance from spherov2} stance 
     */
    constructor(r2d2_found, utils, stance){
        this.r2d2_found = r2d2_found
        this.utils = utils
        this.stance = stance
}
/**
 * Turns dome with pause after. 
 * @param {number} degrees 
 */
async turn_dome_with_wait(degrees) {
    await this.r2d2_found.turnDome(degrees);
    await this.utils.wait(2000);
}
/**
 * Plays animation number with pause after. 
 * @param {number} anim_num 
 */
async play_animation(anim_num){
    await this.r2d2_found.playAnimation(anim_num);
    await this.utils.wait(10000);
}
/**Start up sequence after connection. */
async start_r2d2(){
    await this.set_stance(3);
    await this.utils.wait(4000);
}
/**
 * **Changes stance of R2-D2 based on number of legs, then pause. 
 * @param {number} num_legs 
 */
async set_stance(num_legs){
    if (num_legs === 2) {
        await this.r2d2_found.setStance(this.stance.bipod)
    } else if (num_legs === 3) {
        await this.r2d2_found.setStance(this.stance.tripod)
    } else {
        return
    }
    await this.utils.wait(2000);
    
}

manualRoll(speed, heading, flags){
    console.log('ROLLING')
    this.r2d2_found.roll(speed, heading, flags)
}
}


exports.r2d2Functions = r2d2Functions