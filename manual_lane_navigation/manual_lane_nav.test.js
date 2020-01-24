const {ManualLaneNav} = require('./manual_lane_naviation')
const cv = require('opencv4nodejs');



describe('stabilizeSteering', () => {
    it('test stabilize steering', async() => {
        const resultOverThresholdNegative = ManualLaneNav.stabilize_steering(0, -10);
        expect(resultOverThresholdNegative).toStrictEqual(-5);
        const resultOverThresholdPositive = ManualLaneNav.stabilize_steering(0, 10)
        expect(resultOverThresholdPositive).toStrictEqual(5);
        const resultUnderThreshold = ManualLaneNav.stabilize_steering(0, 4);
        expect(resultUnderThreshold).toStrictEqual(4);
        })
})

describe('convertSteeringAngle', () => {
    it('test steering angle conversion', async() => {
        const resultLessThanZero = ManualLaneNav.convert_steering_angle(-10);
        expect(resultLessThanZero).toStrictEqual(350);
        const resultGreaterThanZero = ManualLaneNav.convert_steering_angle(10);
        expect(resultGreaterThanZero).toStrictEqual(10);
        })
})
