class r2d2Initialize{
    constructor(r2d2_found, scanner, utils, stance){
        this.r2d2_found = r2d2_found
        this.scanner = scanner
        this.utils = utils
        this.stance = stance
}

async turn_dome_with_wait(degrees) {
    await this.r2d2_found.turnDome(degrees);
    await this.utils.wait(2000);
}

async play_animation(anim_num){
    await this.r2d2_found.playAnimation(anim_num);
    await this.utils.wait(10000);
}

async start_r2d2(){
    await this.set_stance(3);
    await this.utils.wait(2000);
}
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
}



exports.r2d2Initialize = r2d2Initialize