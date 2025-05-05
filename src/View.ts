import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { RubicksCube } from './RubicksCube';
import { Shuffle } from './Shuffle';

export class View {

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.Camera;
    controls: TrackballControls;

    cubeSize: number;
    dimension: number;
    cameraDistance: number;

    canvas: HTMLElement;

    rubiksCube: RubicksCube;

    constructor(cubeSize: number, dimension: number, cameraDistance: number, canvas: HTMLElement) {
        this.cubeSize = cubeSize;
        this.dimension = dimension;
        this.cameraDistance = cameraDistance;
        this.canvas = canvas;

        this.scene = new THREE.Scene();
        this.renderer = this.#setupRenderer();
        this.camera = this.#setupCamera();
        this.controls = this.#setupControls();
        
        this.#createFog();

        // Debugging position and rotation of the cube
        // showAxes();

        this.rubiksCube = new RubicksCube(cubeSize, dimension);
        for (let cubie of this.rubiksCube.cubies)
            this.scene.add(cubie.graphics);
    }
    
    #setupRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.animate = this.animate.bind(this);
        renderer.setAnimationLoop(this.animate);
        this.canvas.appendChild(renderer.domElement);
        return renderer;
    }
    
    #setupCamera(): THREE.Camera {
        let fov = 45;
        let aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        let near = this.cameraDistance - (this.cubeSize * Math.sqrt(3)) / 2;
        let far = this.cameraDistance + (this.cubeSize * Math.sqrt(3)) / 2;
        let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
        let cameraPosition = this.cameraDistance / Math.sqrt(3);
        camera.position.set(cameraPosition, cameraPosition, cameraPosition);
        return camera;
    }
    
    #setupControls(): TrackballControls {
        let controls = new TrackballControls(this.camera, this.renderer.domElement);
        controls.rotateSpeed = 2;
        controls.noZoom = true;
        controls.noPan = true;
        controls.target.set(0, 0, 0);
        return controls;
    }

    #createFog(): void {
        let color = 0x000000;
        let near = this.cameraDistance - (this.cubeSize * Math.sqrt(3)) / 2;
        let far = this.cameraDistance + (this.cubeSize * Math.sqrt(3)) / 2;
        this.scene.fog = new THREE.Fog(color, near, far);
    }
    
    #showAxes(): void {
        let axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper);
    }

    animate(): void {
        this.controls.update();
        this.rubiksCube.update();
	    this.renderer.render(this.scene, this.camera);
    }
}
