import * as THREE from "three";
import {CubeView} from "./CubeView";
import {Vector} from "../model/geometry/Vector";
import {Cubie} from "../model/Cubie";

export class LayersRotation {

    cubeView: CubeView
    scene: THREE.Scene

    axis: THREE.Vector3
    planes: Array<number>

    originalGroup: THREE.Group

    cubiesInLayer: Array<Cubie>
    moveGroup: THREE.Group | undefined
    initialQuaternion: THREE.Quaternion | undefined


    constructor(cubeView: CubeView, scene: THREE.Scene, axis: Vector, planes: Array<number>) {
        this.cubeView = cubeView
        this.scene = scene
        this.axis = new THREE.Vector3(axis.x, axis.y, axis.z)
        this.planes = planes
        this.originalGroup = this.cubeView.group

        this.cubiesInLayer = new Array<Cubie>()
        for(let cubieView of this.cubeView.cubieViews)
            if(cubieView.cubie.inAxisLayers(axis, planes))
                this.cubiesInLayer.push(cubieView.cubie)
    }

    setStepFraction(stepFraction: number): void {
        if(!this.moveGroup) this.setupGroup()
        const angle: number = stepFraction * (Math.PI / 2)
        const quaternion = new THREE.Quaternion().setFromAxisAngle(this.axis, angle)
        this.moveGroup!.quaternion.copy(this.initialQuaternion!)
        this.moveGroup!.quaternion.premultiply(quaternion)
    }

    private setupGroup(): void {
        this.moveGroup = new THREE.Group()
        for(let cubieView of this.cubeView.cubieViews)
            if(this.cubiesInLayer.includes(cubieView.cubie))
                this.moveGroup.add(cubieView.meshGroup)
        this.scene.add(this.moveGroup)
        this.initialQuaternion = this.moveGroup.quaternion.clone()
    }

    cleanup(): void {
        if(!this.moveGroup) return
        this.moveGroup.updateMatrixWorld(true)
        Array.from(this.moveGroup.children).forEach(mesh => {
            this.scene.attach(mesh)
            this.originalGroup.attach(mesh)
        })
        this.scene.remove(this.moveGroup)
    }
}
