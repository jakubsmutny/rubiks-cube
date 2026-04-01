import * as THREE from "three";
import {CubeView} from "../CubeView";
import {Vector} from "../../model/geometry/Vector";
import {CubieView} from "../CubieView";

export class LayerRotation {

    cubeView: CubeView
    scene: THREE.Scene

    axis: THREE.Vector3
    planes: Array<number>

    cubieViewsInLayer: Array<CubieView>
    originalFaceGroup: THREE.Group

    activeTurnStep: number
    groupsSetUp: boolean

    faceGroup: THREE.Group | undefined
    initialFaceGroupQuaternion: THREE.Quaternion | undefined
    moveDividerGroup: THREE.Group | undefined
    initialDividerGroupQuaternion: THREE.Quaternion | undefined
    staticDividerGroup: THREE.Group | undefined

    constructor(cubeView: CubeView, scene: THREE.Scene, axis: Vector, planes: Array<number>) {
        this.cubeView = cubeView
        this.scene = scene
        this.axis = new THREE.Vector3(axis.x, axis.y, axis.z)
        this.planes = planes.sort()
        this.originalFaceGroup = this.cubeView.group

        this.cubieViewsInLayer = new Array<CubieView>()
        for(let cubieView of this.cubeView.cubieViews)
            if(cubieView.cubie.inAxisLayers(axis, planes))
                this.cubieViewsInLayer.push(cubieView)

        this.activeTurnStep = 0
        this.groupsSetUp = false
    }

    setStepFraction(stepFraction: number): void {
        if(!this.groupsSetUp) this.setupGroups()
        this.activeTurnStep = stepFraction
        const angle: number = stepFraction * (Math.PI / 2)
        const moveFromInitial: THREE.Quaternion = new THREE.Quaternion().setFromAxisAngle(this.axis, angle)
        this.faceGroup!.quaternion.copy(this.initialFaceGroupQuaternion!)
        this.faceGroup!.quaternion.premultiply(moveFromInitial)
        this.moveDividerGroup!.quaternion.copy(this.initialDividerGroupQuaternion!)
        this.moveDividerGroup!.quaternion.premultiply(moveFromInitial)
    }

    isFinished(): boolean {
        return this.activeTurnStep % 1 === 0
    }

    private setupGroups(): void {
        this.setupFaceGroup()
        this.setupDividerGroups()
        this.groupsSetUp = true
    }

    private setupFaceGroup(): void {
        this.faceGroup = new THREE.Group()
        this.initialFaceGroupQuaternion = this.faceGroup.quaternion.clone()
        this.scene.add(this.faceGroup)
        for(let cubieView of this.cubieViewsInLayer)
            this.faceGroup.add(cubieView.meshGroup)
    }

    private setupDividerGroups() {
        this.moveDividerGroup = new THREE.Group()
        this.staticDividerGroup = new THREE.Group()
        this.initialDividerGroupQuaternion = this.moveDividerGroup.quaternion.clone()
        this.scene.add(this.moveDividerGroup)
        this.scene.add(this.staticDividerGroup)

        const gp = this.cubeView.geometryProvider
        const geometry = this.cubeView.geometryProvider.getTurnSideGeometry()
        const material = this.cubeView.materialProvider.getBackgroundMaterial()

        const planeIncluded = Array<boolean>(this.cubeView.geometryProvider.dimension).fill(false)
        for(let plane of this.planes) planeIncluded[plane] = true

        for(let i = 1; i < planeIncluded.length; i++) {
            if(planeIncluded[i] === planeIncluded[i - 1]) continue
            const shift = new THREE.Vector3().copy(this.axis).setLength(gp.cubieSize * i - (gp.cubeSize / 2))
            const negAxis = new THREE.Vector3().copy(this.axis).negate()

            const forwardMesh = new THREE.Mesh(geometry, material)
            const backwardMesh = new THREE.Mesh(geometry, material)
            forwardMesh.position.copy(shift)
            backwardMesh.position.copy(shift)
            forwardMesh.lookAt(this.axis)
            backwardMesh.lookAt(negAxis)

            this.moveDividerGroup.add(planeIncluded[i] ? backwardMesh : forwardMesh)
            this.staticDividerGroup.add(planeIncluded[i] ? forwardMesh : backwardMesh)
        }
    }

    cleanup(): void {
        if(!this.groupsSetUp) return
        this.faceGroup!.updateMatrixWorld(true)
        this.scene.remove(this.faceGroup!)
        this.scene.remove(this.moveDividerGroup!)
        this.scene.remove(this.staticDividerGroup!)
        Array.from(this.faceGroup!.children).forEach(mesh => {
            this.scene.attach(mesh)
            this.originalFaceGroup.attach(mesh)
        })
        this.moveDividerGroup!.clear()
        this.staticDividerGroup!.clear()
        this.activeTurnStep = 0
        this.groupsSetUp = false
    }
}
