import * as THREE from "three";
import {Cubie} from "../model/Cubie";
import {Vector} from "../model/geometry/Vector";
import {SceneView} from "../view/SceneView";
import {Axis} from "../model/geometry/Axis";

export class Drag {

    sceneView: SceneView

    startPosition: THREE.Vector2
    currentPosition: THREE.Vector2

    clickedCubie: Cubie
    normal: Vector

    rail: THREE.Vector2 | undefined
    lockedVector: Vector | undefined

    constructor(sceneView: SceneView, startPosition: THREE.Vector2, intersection: THREE.Intersection) {
        this.sceneView = sceneView
        this.startPosition = startPosition.clone()
        this.currentPosition = startPosition.clone()
        this.clickedCubie = intersection.object.userData.cubieView.cubie
        const faceNormal: THREE.Vector3 = intersection.face ? intersection.face.normal.normalize() : new THREE.Vector3()
        this.normal = new Vector(faceNormal.x + 0, faceNormal.y + 0, faceNormal.z + 0)
    }

    updatePosition(position: THREE.Vector2): void {
        this.currentPosition = position
        if(!this.rail) {
            this.lockRailVector()
        }
        // TODO Clear this
        else {
            console.log(this.getDragVector().dot(this.rail))
        }
    }

    getSize(): number {
        if(!this.rail) return 0
        return this.getDragVector().dot(this.rail)
    }

    private lockRailVector(): void {
        if(this.lockedVector) return
        const [vector1, vector2] = Axis.getOrthogonal(this.normal)
        const sceneVector1: THREE.Vector3 = new THREE.Vector3(vector1.x, vector1.y, vector1.z)
        const sceneVector2: THREE.Vector3 = new THREE.Vector3(vector2.x, vector2.y, vector2.z)
        const rail1: THREE.Vector2 = this.projectSceneVectorToScreen(sceneVector1).normalize()
        const rail2: THREE.Vector2 = this.projectSceneVectorToScreen(sceneVector2).normalize()
        const projection1 = this.getDragVector().dot(rail1)
        const projection2 = this.getDragVector().dot(rail2)
        this.rail = Math.abs(projection1) > Math.abs(projection2) ? rail1 : rail2
        this.lockedVector = Math.abs(projection1) > Math.abs(projection2) ? vector1 : vector2
    }

    private getDragVector(): THREE.Vector2 {
        return this.currentPosition.clone().sub(this.startPosition)
    }

    private projectSceneVectorToScreen(sceneVector: THREE.Vector3): THREE.Vector2 {
        const endPoint: THREE.Vector2 = this.projectScenePointToScreen(sceneVector)
        const startPoint: THREE.Vector2 = this.projectScenePointToScreen(new THREE.Vector3(0, 0, 0))
        return endPoint.clone().sub(startPoint)
    }

    private projectScenePointToScreen(scenePoint: THREE.Vector3): THREE.Vector2 {
        const projected = scenePoint.clone().project(this.sceneView.camera)
        const x: number = (projected.x * 0.5 + 0.5) * this.sceneView.canvas.clientWidth
        const y: number = (projected.y * -0.5 + 0.5) * this.sceneView.canvas.clientHeight
        return new THREE.Vector2(x, y)
    }
}
