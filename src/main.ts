import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { RubicksCube } from './RubicksCube';
import { Shuffle } from './Shuffle';

var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var camera: THREE.Camera;
var controls: TrackballControls;

var rubiksCube: RubicksCube;

main();

function main(): void {

    const cubeSize = 3;
    const dimension = 3;
    const cameraDistance = 10;

    scene = new THREE.Scene();
    setupRenderer();
    setupCamera(cubeSize, cameraDistance);

    setupControls();
    createFog(cubeSize, cameraDistance);
    
    // Debugging position and rotation of the cube
    // showAxes();

    rubiksCube = new RubicksCube(cubeSize, dimension);
    for (let cubie of rubiksCube.cubies)
        scene.add(cubie.graphics);
}


// Testing user input
document.getElementById("shuffleButton")!.addEventListener("click", addShuffle);
document.querySelector('#shuffle')!.addEventListener('keypress', (e) => {
    const event = e as KeyboardEvent;
    if(event.key === 'Enter') addShuffle();
});

function addShuffle() {
    let inputField = document.getElementById("shuffle")! as HTMLInputElement;
    let value = inputField.value;
    let shuffle = Shuffle.fromNotation(value, rubiksCube.dimension);
    rubiksCube.manipulate(shuffle);
    inputField.value = "";
}


function animate(): void {
    controls.update();
    rubiksCube.update();
	renderer.render(scene, camera);
}

function showAxes(): void {
    let axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
}

function createFog(cubeSize: number, cameraDistance: number): void {
    let color = 0x000000;
    let near = cameraDistance - (cubeSize * Math.sqrt(3)) / 2;
    let far = cameraDistance + (cubeSize * Math.sqrt(3)) / 2;
    scene.fog = new THREE.Fog(color, near, far);
}

function setupRenderer(): void {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);
}

function setupCamera(cubeSize: number, cameraDistance: number): void {
    let fov = 45;
    let aspect = window.innerWidth / window.innerHeight;
    let near = cameraDistance - (cubeSize * Math.sqrt(3)) / 2;
    let far = cameraDistance + (cubeSize * Math.sqrt(3)) / 2;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    let cameraPosition = cameraDistance / Math.sqrt(3);
    camera.position.set(cameraPosition, cameraPosition, cameraPosition);
}

function setupControls(): void {
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2;
    controls.noZoom = true;
    controls.noPan = true;
    controls.target.set(0, 0, 0);
}
