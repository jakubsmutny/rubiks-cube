import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { CubeModel } from "../model/CubeModel";
import {SceneController} from "../controller/SceneController";
import {CubeView} from "./CubeView";

export class SceneView {

    static cubeSize: number = 2
    static cameraDistance: number = 5

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;

    // TODO Move this into Controller
    controls: TrackballControls;

    cubeModel: CubeModel
    cubeView: CubeView

    constructor(cubeModel: CubeModel, canvasName: string) {
        this.cubeModel = cubeModel
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement

        this.scene = new THREE.Scene()
        this.renderer = this.setupRenderer()
        this.camera = this.setupCamera()
        this.controls = this.setupControls()
        
        this.createFog();

        // Debugging position and rotation of the cube
        // this.#showAxes();

        this.cubeView = new CubeView()
    }

    getController(): SceneController {
        return new SceneController()
    }
    
    private setupRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer({canvas: this.canvas as HTMLCanvasElement}); // renderer. setSize (window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domELement);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        renderer.setAnimationLoop(this.animate);
        //this.canvas.appendChild(renderer.domElement);
        return renderer;
    }
    
    private setupCamera(): THREE.PerspectiveCamera {
        let fov = 45;
        let aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2;
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(3)) / 2;
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
        let cameraPosition = SceneView.cameraDistance / Math.sqrt(3);
        camera.position.set(cameraPosition, cameraPosition, cameraPosition);
        return camera;
    }
    
    private setupControls(): TrackballControls {
        let controls = new TrackballControls(this.camera, this.renderer.domElement);
        controls.rotateSpeed = 2;
        controls.noZoom = true;
        controls.noPan = true;
        controls.target.set(0, 0, 0);
        return controls;
    }

    private createFog(): void {
        let color = 0x000000;
        let near = SceneView.cameraDistance - (SceneView.cubeSize * Math.sqrt(3)) / 2;
        let far = SceneView.cameraDistance + (SceneView.cubeSize * Math.sqrt(3)) / 2;
        this.scene.fog = new THREE.Fog(color, near, far);
    }
    
    private showAxes(): void {
        let axesHelper = new THREE.AxesHelper(50)
        this.scene.add(axesHelper)
    }

    private animate = (): void => {
        this.controls.update()
        this.cubeView.update()
        this.renderer.render(this.scene, this.camera)
    }
}
