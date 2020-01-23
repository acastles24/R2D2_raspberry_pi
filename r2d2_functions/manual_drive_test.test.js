const {ManualControl} = require('./manual_drive')

describe('convertVelocitytoMag', () => {
    it('test convert velocity comp to mag', async() => {
        const resultNonZero = ManualControl.convertVelocityCompToMag(1, 1)
        expect(resultNonZero).toStrictEqual(250);
        const resultZero = ManualControl.convertVelocityCompToMag(0, 0)
        expect(resultZero).toStrictEqual(0);
        })
})

describe('convertJoystickRad', () => {
    it('test convert joystick angle to heading', async() => {
        const resultlessThanZero = ManualControl.convertJoystickRadtoHeading(-3.14)
        expect(resultlessThanZero).toStrictEqual(180);
        const resultZero = ManualControl.convertJoystickRadtoHeading(3.14)
        expect(resultZero).toStrictEqual(180);
        })
})


describe('parseManualControlMessage', () => {
    it('test manual control message parsing', async() => {
        const message = "velX = 1 velY = 0.9 ang = 89.09"
        const parsed = ManualControl.parseManualControlMessage(message)
        expect(parsed.velX).toStrictEqual(1)
        expect(parsed.velY).toStrictEqual(0.9)
        expect(parsed.ang).toStrictEqual(89.09)
    })
})