# R2-D2 Raspberry Pi

*A remote control R2-D2 robot powered by on-board Raspberry Pi with real-time joystick control using companion iOS
application.* 

[Demo Video](https://youtu.be/7wxGOOxmoIk "Manual Drive Demo Video")

[Link to iOS App](https://github.com/acastles24/R2-D2_iOS_app "Link to iOS App")

![Alt text](R2-D2_Robot.jpeg?raw=true "R2-D2 Robot with on-board Raspberry Pi")

## Technologies
* Raspberry Pi 3 B+
* Raspbian Linux Operating System
* Bluetooth
* JavaScript
* Node.js

## Code

### Establishes Connection
Upon startup, the Raspberry Pi automatically establishes a Bluetooth connection with the robot motors. R2-D2's stance is then set to tripod; he's ready for action!

```javascript
r2d2_connected = await connect(Scanner, R2D2);
r2d2_functions = new r2d2Functions(r2d2_connected, Utils, Stance)
if (!r2d2_functions.r2d2_found){
    console.log('Robot not found')
    return
}
await r2d2_functions.resetHeading()
await r2d2_functions.set_stance(3)
```



### Manual Control from iOS App
Once a input payload is received from the iOS app, the Manual Control class parses the intended robot velocity and direction then calls the custom robot API with the commands as input.

```javascript

class ManualControl{
    constructor(r2d2_functions){
        this.r2d2_functions = r2d2_functions
    }

    async execute(message){
        let manualRequest = ManualControl.parseManualControlMessage(message)
        let speed = ManualControl.convertVelocityCompToMag(manualRequest.velX, manualRequest.velY)
        let heading = ManualControl.convertJoystickRadtoHeading(manualRequest.ang)
        console.log(speed + ' ' + heading)
        await this.r2d2_functions.manualRoll(speed, heading, [2])
    }
```

## Future Work
* Utilize camera to enable automated lane navigation using OpenCV library.
* Implement Tensorflow machine learning platform for lane navigation.
