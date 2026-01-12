import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { RubiksCube } from './RubiksCube';
import { Shuffle } from './Shuffle';

export class SceneEngine {

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: TrackballControls;

    cubeSize: number;
    dimension: number;
    cameraDistance: number;

    canvas: HTMLCanvasElement;

    rubiksCube: RubiksCube;

    constructor(cubeSize: number, dimension: number, cameraDistance: number, canvasName: string) {
        this.cubeSize = cubeSize;
        this.dimension = dimension;
        this.cameraDistance = cameraDistance;
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement;

        this.scene = new THREE.Scene();
        this.renderer = this.#setupRenderer();
        this.camera = this.#setupCamera();
        this.controls = this.#setupControls();
        
        this.#createFog();

        // Debugging position and rotation of the cube
        // this.#showAxes();

        this.rubiksCube = new RubiksCube(cubeSize, dimension);
        for(let cubie of this.rubiksCube.cubies)
            this.scene.add(cubie.graphics);

        // TODO Test user input
        document.getElementById("shuffleButton")!.addEventListener("click", () => { this.addShuffle(); });
        document.querySelector('#shuffle')!.addEventListener('keypress', (e) => {
            const event = e as KeyboardEvent;
            if(event.key === 'Enter') this.addShuffle();
        });

        //const select = document.getElementById("dimensionSelect") as HTMLSelectElement;
        //select.addEventListener("change", () => {
        //    const dim = Number(select.value);
        //    for (let cubie of this.rubiksCube.cubies)
        //        this.scene.remove(cubie.graphics);
        //    this.rubiksCube = new RubiksCube(this.cubeSize, dim);
        //    for (let cubie of this.rubiksCube.cubies)
        //        this.scene.add(cubie.graphics);
        //    this.dimension = dim;
        //});
    }
    
    #setupRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer({canvas: this.canvas as HTMLCanvasElement}); // renderer. setSize (window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domELement);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        renderer.setAnimationLoop(this.animate);
        //this.canvas.appendChild(renderer.domElement);
        return renderer;
    }
    
    #setupCamera(): THREE.PerspectiveCamera {
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

    animate = (): void => {
        this.controls.update();
        this.rubiksCube.update();
        this.renderer.render(this.scene, this.camera);
    };

    // TODO Test user input
    addShuffle(): void {
        let inputField = document.getElementById("shuffle")! as HTMLInputElement;
        let value = inputField.value;
        let shuffle = Shuffle.fromNotation(value, this.rubiksCube.dimension);
        this.rubiksCube.manipulate(shuffle);
        inputField.value = "";
    }
}

document.addEventListener('mousedown', onMouseDown);
//document.addEventListener('touchstart', onMouseDown);
document.addEventListener('mouseup' , onMouseUp);

function onMouseUp(event: MouseEvent): void {
    console.log(`Mouse up at (${event.clientX}, ${event.clientY})`);
}

function onMouseDown(event: MouseEvent): void {
    console.log(`Mouse down at (${event.clientX}, ${event.clientY})`);
}
