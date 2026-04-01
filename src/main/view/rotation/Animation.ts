import * as TWEEN from "@tweenjs/tween.js"
import {LayerRotation} from "./LayerRotation"

export class Animation {

    static normalTurnDuration: number = 400
    turnDuration: number

    started: boolean
    finished: boolean

    layerRotation: LayerRotation
    private tween: TWEEN.Tween<{fraction: number}>

    constructor(layerRotation: LayerRotation, turnSize: number, speed: number = 1) {
        this.turnDuration = Animation.normalTurnDuration / speed
        this.started = false
        this.finished = false
        this.layerRotation = layerRotation

        const start = {fraction: layerRotation.activeTurnStep}
        const end = {fraction: layerRotation.activeTurnStep + turnSize}
        this.tween = new TWEEN.Tween(start)
            .to(end, this.turnDuration * Math.abs(turnSize))
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                this.layerRotation.setStepFraction(start.fraction)
            })
            .onComplete(() => {
                this.layerRotation.cleanup()
                this.finished = true
            })
    }

    start(group: TWEEN.Group) {
        this.tween.group(group)
        this.tween.start()
        this.started = true
    }
}
