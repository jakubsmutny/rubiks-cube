import {SceneView} from "../view/SceneView";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";
import {Drag} from "./Drag";
import {CubeModel} from "../model/CubeModel";
import {MoveFactory} from "../model/factories/MoveFactory";
import {Shuffle} from "../model/manipulation/Shuffle";
import {Move} from "../model/manipulation/Move";

export class SceneController {

    sceneView: SceneView
    cubeModel: CubeModel

    moveFactory: MoveFactory

    trackballControls: TrackballControls

    raycaster: THREE.Raycaster
    drag: Drag | undefined

    constructor(sceneView: SceneView, cubeModel: CubeModel) {
        this.sceneView = sceneView
        this.cubeModel = cubeModel
        this.moveFactory = new MoveFactory(cubeModel.dimension)
        this.raycaster = new THREE.Raycaster()
        this.setupEventListeners()
        this.trackballControls = this.setupControls()
    }

    update(): void {
        this.trackballControls.update()
    }

    onPointerDown = (event: MouseEvent): void => {
        if(event.button === 2) return
        if(this.sceneView.cubeView.isAnimating()) return
        const mousePosition: THREE.Vector2 = new THREE.Vector2(event.clientX, event.clientY)
        const canvas = event.target as HTMLCanvasElement
        const rect = canvas.getBoundingClientRect()
        const canvasX: number = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1
        const canvasY: number = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1
        this.raycaster.setFromCamera(new THREE.Vector2(canvasX, canvasY), this.sceneView.camera)
        const intersects = this.raycaster.intersectObjects([this.sceneView.cubeView.group], true)
        if(intersects.length > 0 && intersects[0].object.userData.cubieView !== undefined) {
            this.trackballControls.noRotate = true
            const intersection = intersects[0]
            this.drag = new Drag(this.sceneView, mousePosition, intersection, event.button)
        }
    }

    onPointerUp = (event: MouseEvent): void => {
        if(this.drag) {
            this.drag.layersRotation?.cleanup()
            this.sceneView.cubeView.activeTurnSize = Move.reduceTurn(this.drag.getTurnSize())
            if(this.drag.rail) {
                const moveShuffle: Shuffle = new Shuffle([this.moveFactory.createFromDrag(this.drag)])
                this.cubeModel.manipulate(moveShuffle)
            }
            this.drag = undefined
            this.trackballControls.noRotate = false
        }
    }

    onPointerMove = (event: MouseEvent): void => {
        if(this.drag) {
            const mousePosition = new THREE.Vector2(event.clientX, event.clientY)
            this.drag.updatePosition(mousePosition)
        } else {
            this.trackballControls.noRotate = false
        }
    }

    setCubeModel(cubeModel: CubeModel): void {
        this.cubeModel = cubeModel
        this.moveFactory = new MoveFactory(cubeModel.dimension)
        this.drag = undefined
    }

    private setupEventListeners(): void {
        this.sceneView.canvas.addEventListener('pointerdown', this.onPointerDown)
        document.addEventListener('pointerup', this.onPointerUp)
        document.addEventListener('pointermove', this.onPointerMove)
        this.sceneView.canvas.addEventListener('contextmenu', (e) => { e.preventDefault() }, true)
    }

    removeEventListeners(): void {
        this.sceneView.canvas.removeEventListener('pointerdown', this.onPointerDown)
        document.removeEventListener('pointerup', this.onPointerUp)
        document.removeEventListener('pointermove', this.onPointerMove)
        this.sceneView.canvas.removeEventListener('contextmenu', (e) => { e.preventDefault() })
    }

    private setupControls(): TrackballControls {
        let controls = new TrackballControls(
            this.sceneView.camera, this.sceneView.renderer.domElement
        )
        controls.rotateSpeed = 3
        controls.noZoom = true
        controls.noPan = true
        controls.target.set(0, 0, 0)
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: null
        }
        controls.domElement = document.body as any
        return controls;
    }
}
