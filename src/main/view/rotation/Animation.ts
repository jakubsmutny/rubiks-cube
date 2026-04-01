import * as TWEEN from "@tweenjs/tween.js"
import {LayerRotation} from "./LayerRotation"

export class Animation {

    static simpleTurnDuration: number = 400

    started: boolean
    finished: boolean

    layerRotation: LayerRotation
    private tween: TWEEN.Tween<{fraction: number}>

    constructor(layerRotation: LayerRotation, moveStep: number) {
        this.started = false
        this.finished = false
        this.layerRotation = layerRotation

        const turnSize = Math.abs(layerRotation.activeTurnStep - moveStep)
        const start = {fraction: layerRotation.activeTurnStep}
        const end = {fraction: moveStep}
        this.tween = new TWEEN.Tween(start)
            .to(end, Animation.simpleTurnDuration * turnSize)
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
