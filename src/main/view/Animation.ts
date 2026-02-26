import * as THREE from "three"
import * as TWEEN from "@tweenjs/tween.js"
import {Move} from "../model/manipulation/Move"
import {LayersRotation} from "./LayersRotation"
import {CubeView} from "./CubeView"

export class Animation {

    static simpleTurnDuration: number = 400

    cubeView: CubeView
    started: boolean
    finished: boolean

    layersRotation: LayersRotation
    private tween: TWEEN.Tween<{fraction: number}>

    constructor(cubeView: CubeView, scene: THREE.Scene, move: Move) {
        this.cubeView = cubeView
        this.started = false
        this.finished = false
        this.layersRotation = new LayersRotation(cubeView, scene, move.axis, move.planes)

        const turnSize = Move.reduceTurn(move.steps - cubeView.activeTurnSize)
        const start = {fraction: 0}
        const end = {fraction: turnSize}

        this.tween = new TWEEN.Tween(start)
            .to(end, Animation.simpleTurnDuration * Math.abs(turnSize))
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                this.layersRotation.setStepFraction(start.fraction)
            })
            .onComplete(() => {
                this.layersRotation.cleanup()
                this.finished = true
            })
    }

    start(group: TWEEN.Group) {
        this.cubeView.activeTurnSize = 0
        this.tween.group(group)
        this.tween.start()
        this.started = true
    }
}
