import * as THREE from "three";
import {Cubie} from "../model/Cubie";
import {Vector} from "../model/geometry/Vector";
import {SceneView} from "../view/SceneView";
import {Axis} from "../model/geometry/Axis";

export class Drag {

    sceneView: SceneView

    startPosition: THREE.Vector2
    currentPosition: THREE.Vector2

    button: number

    clickedCubie: Cubie
    normal: Vector

    rail: THREE.Vector2 | undefined
    rotationAxis: Vector

    constructor(sceneView: SceneView, startPosition: THREE.Vector2, intersection: THREE.Intersection, button: number) {
        this.sceneView = sceneView
        this.startPosition = startPosition.clone()
        this.currentPosition = startPosition.clone()
        this.button = button
        this.clickedCubie = intersection.object.userData.cubieView.cubie
        const faceNormal: THREE.Vector3 = !intersection.face ? new THREE.Vector3() :
            intersection.face.normal.clone().transformDirection(intersection.object.matrixWorld).normalize()
        this.normal = new Vector(Math.round(faceNormal.x), Math.round(faceNormal.y), Math.round(faceNormal.z))
        this.rotationAxis = Axis.undefined
    }

    updatePosition(position: THREE.Vector2): void {
        this.currentPosition = position
        if(!this.rail && this.getDragVector().length() > 10) {
            this.lockRailVector()
            this.setupMeshes()
        }
        if(this.rail) {
            this.moveMeshes()
        }
    }

    moveGroup: THREE.Group = new THREE.Group()
    initialQuaternion: THREE.Quaternion = new THREE.Quaternion()
    originalParent: THREE.Group | null = null
    private setupMeshes(): void {
        const planes: number[] = new Array<number>()
        if(this.rotationAxis.equals(Axis.X)) planes.push(this.clickedCubie.position.i)
        if(this.rotationAxis.equals(Axis.Y)) planes.push(this.clickedCubie.position.j)
        if(this.rotationAxis.equals(Axis.Z)) planes.push(this.clickedCubie.position.k)
        this.originalParent = this.sceneView.cubeView.group
        this.moveGroup = this.sceneView.cubeView.getTemporaryGroup(this.rotationAxis, planes)
        this.sceneView.scene.add(this.moveGroup)
        this.initialQuaternion = this.moveGroup.quaternion.clone()
    }
    private moveMeshes(): void {
        const axis: THREE.Vector3 = new THREE.Vector3(this.rotationAxis.x, this.rotationAxis.y, this.rotationAxis.z)
        const angle = (this.getInRailSize() / 200) * (Math.PI / 2) // Convert pixels to radians
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle)
        this.moveGroup.quaternion.copy(this.initialQuaternion).premultiply(quaternion)
    }

    getInRailSize(): number {
        if(!this.rail) return 0
        return this.getDragVector().dot(this.rail)
    }

    private lockRailVector(): void {
        if(this.rail) return
        const [vector1, vector2] = Axis.getOrthogonal(this.normal)
        const sceneVector1: THREE.Vector3 = new THREE.Vector3(vector1.x, vector1.y, vector1.z)
        const sceneVector2: THREE.Vector3 = new THREE.Vector3(vector2.x, vector2.y, vector2.z)
        const rail1: THREE.Vector2 = this.projectSceneVectorToScreen(sceneVector1).normalize()
        const rail2: THREE.Vector2 = this.projectSceneVectorToScreen(sceneVector2).normalize()
        const projection1 = this.getDragVector().dot(rail1)
        const projection2 = this.getDragVector().dot(rail2)
        this.rotationAxis = Math.abs(projection1) < Math.abs(projection2) ? vector1 : vector2
        const positiveRotationVector = new THREE.Vector3().crossVectors(this.rotationAxis, this.normal).normalize()
        this.rail = this.projectSceneVectorToScreen(positiveRotationVector).normalize()
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

    cleanup(): void {
        if(this.originalParent && this.moveGroup) {
            // Apply current rotation to each mesh's world matrix
            //this.moveGroup.updateMatrixWorld(true)
            const meshes = [...this.moveGroup.children]
            meshes.forEach(mesh => {
                this.sceneView.scene.attach(mesh) // Preserve world transform
                this.originalParent!.attach(mesh) // Move back to original parent
            })
            this.sceneView.scene.remove(this.moveGroup)
        }
    }
}
