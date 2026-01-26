import * as THREE from "three";
import {CubeView} from "./CubeView";
import {Vector} from "../model/geometry/Vector";

export class LayersRotation {

    cubeView: CubeView
    scene: THREE.Scene

    axis: THREE.Vector3
    planes: Array<number>

    moveGroup: THREE.Group
    initialQuaternion: THREE.Quaternion

    originalGroup: THREE.Group

    constructor(cubeView: CubeView, scene: THREE.Scene, axis: Vector, planes: Array<number>) {
        this.cubeView = cubeView
        this.scene = scene
        this.axis = new THREE.Vector3(axis.x, axis.y, axis.z)
        this.planes = planes

        this.moveGroup = this.cubeView.getTemporaryGroup(axis, planes)
        this.scene.add(this.moveGroup)
        this.initialQuaternion = this.moveGroup.quaternion.clone()

        this.originalGroup = this.cubeView.group
    }

    setStepFraction(stepFraction: number): void {
        const angle: number = stepFraction * (Math.PI / 2)
        const quaternion = new THREE.Quaternion().setFromAxisAngle(this.axis, angle)
        this.moveGroup.quaternion.copy(this.initialQuaternion)
        this.moveGroup.quaternion.premultiply(quaternion)
    }

    cleanup(): void {
        this.moveGroup.updateMatrixWorld(true)
        Array.from(this.moveGroup.children).forEach(mesh => {
            this.scene.attach(mesh)
            this.originalGroup.attach(mesh)
        })
        this.scene.remove(this.moveGroup)
    }
}
