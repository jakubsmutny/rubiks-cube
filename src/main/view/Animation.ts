import * as THREE from "three"
import {Move} from "../model/manipulation/Move"
import {LayersRotation} from "./LayersRotation"
import {CubeView} from "./CubeView"

export class Animation {

    static simpleTurnDuration: number = 1000

    cubeView: CubeView
    scene: THREE.Scene
    move: Move

    running: boolean

    layersRotation: LayersRotation | undefined

    constructor(cubeView: CubeView, scene: THREE.Scene, move: Move) {
        this.cubeView = cubeView
        this.scene = scene
        this.move = move
        this.running = false
    }

    start() {
        this.layersRotation = new LayersRotation(this.cubeView, this.scene, this.move.axis, this.move.planes)
    }

    update() {
        if (!this.running) {
            this.start()
        }


    }


    // is created as a result of move
    // has from and to of meshes positions
    // - important because model can apply bulk moves and possibly
    //   reference of end of move positions doesnt exist anymore

}
