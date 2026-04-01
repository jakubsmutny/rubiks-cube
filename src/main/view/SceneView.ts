import * as THREE from 'three';

import {CubeModel} from "../model/CubeModel";
import {SceneController} from "../controller/SceneController";
import {CubeView} from "./CubeView";

export class SceneView {

    static cubeSize: number = 1
    static cameraDistance: number = 8

    readonly scene: THREE.Scene
    readonly renderer: THREE.WebGLRenderer
    readonly camera: THREE.PerspectiveCamera
    readonly canvas: HTMLCanvasElement

    cubeModel: CubeModel
    readonly sceneController: SceneController

    cubeView: CubeView

    constructor(cubeModel: CubeModel, canvasName: string) {
        this.cubeModel = cubeModel
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement

        this.scene = this.setupScene()
        this.renderer = this.setupRenderer()
        this.camera = this.setupCamera()

        this.sceneController = new SceneController(this, cubeModel)
        this.cubeView = new CubeView(cubeModel, this)
        this.setupEventListeners()
    }

    private animate = (): void => {
        this.sceneController.update()
        this.cubeView.update()
        this.renderer.render(this.scene, this.camera)
    }

    setCubeModel(cubeModel: CubeModel): void {
        this.cubeView.dispose()
        this.cubeModel = cubeModel
        this.sceneController.setCubeModel(cubeModel)
        this.cubeView = new CubeView(cubeModel, this)
    }

    private setupScene(): THREE.Scene {
        const scene = new THREE.Scene()
        this.createFog(scene)
        return scene
    }
    
    private setupRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas as HTMLCanvasElement})
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
        renderer.setAnimationLoop(this.animate)
        return renderer
    }

    private setupCamera(): THREE.PerspectiveCamera {
        let fov = 15
        let aspect = this.canvas.offsetWidth / this.canvas.offsetHeight
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(2)) / 2
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    
        let cameraPosition = SceneView.cameraDistance / Math.sqrt(3)
        camera.position.set(cameraPosition, cameraPosition, cameraPosition)
        return camera
    }

    private createFog(scene: THREE.Scene): void {
        let color = 0x000000
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(3)) / 1.8
        scene.fog = new THREE.Fog(color, near, far)
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', this.onWindowResize)
        window.addEventListener('beforeunload', this.dispose)
    }

    removeEventListeners(): void {
        window.removeEventListener('resize', this.onWindowResize)
        window.removeEventListener('beforeunload', this.dispose)
    }

    private onWindowResize = (): void => {
        this.canvas.style.width = ''
        this.canvas.style.height = ''
        const width = this.canvas.clientWidth
        const height = this.canvas.clientHeight
        this.canvas.width = width
        this.canvas.height = height

        this.renderer.setSize(width, height, false)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.sceneController.trackballControls.handleResize()
    }

    dispose = (): void => {
        this.cubeView.dispose()
        this.renderer.dispose()
        this.sceneController.removeEventListeners()
        this.removeEventListeners()
    }
}
