import * as THREE from 'three';

import {CubeModel} from "../model/CubeModel";
import {SceneController} from "../controller/SceneController";
import {CubeView} from "./CubeView";

export class SceneView {

    static cubeSize: number = 2
    static cameraDistance: number = 5

    readonly scene: THREE.Scene
    readonly renderer: THREE.WebGLRenderer
    readonly camera: THREE.PerspectiveCamera
    readonly canvas: HTMLCanvasElement

    cubeModel: CubeModel
    readonly sceneController: SceneController

    private cubeView: CubeView

    constructor(cubeModel: CubeModel, canvasName: string) {
        this.cubeModel = cubeModel
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement

        this.scene = this.setupScene()
        this.renderer = this.setupRenderer()
        this.camera = this.setupCamera()

        this.sceneController = new SceneController(this)
        this.cubeView = new CubeView(cubeModel)
        this.scene.add(this.cubeView.group)
    }

    private animate = (): void => {
        this.sceneController.update()
        this.cubeView.update()
        this.renderer.render(this.scene, this.camera)
    }

    setCubeModel(cubeModel: CubeModel): void {
        this.scene.remove(this.cubeView.group)
        this.cubeModel = cubeModel
        this.cubeView = new CubeView(cubeModel)
        // TODO update controller
        this.scene.add(this.cubeView.group)
    }

    private setupScene(): THREE.Scene {
        const scene = new THREE.Scene()
        this.createFog(scene)
        return scene
    }
    
    private setupRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer({canvas: this.canvas as HTMLCanvasElement})
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight)
        renderer.setAnimationLoop(this.animate)
        return renderer
    }

    // TODO Make FOV less and cancel fog ?
    private setupCamera(): THREE.PerspectiveCamera {
        let fov = 45
        let aspect = this.canvas.offsetWidth / this.canvas.offsetHeight
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(3)) / 2
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    
        let cameraPosition = SceneView.cameraDistance / Math.sqrt(3)
        camera.position.set(cameraPosition, cameraPosition, cameraPosition)
        return camera
    }

    private createFog(scene: THREE.Scene): void {
        let color = 0x000000
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(3)) / 2
        scene.fog = new THREE.Fog(color, near, far)
    }
}
