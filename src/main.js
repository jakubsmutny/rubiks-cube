import * as THREE from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { RubicksCube } from './RubicksCube.js';

var scene;
var camera;
var renderer;
var controls;

main();

function main() {

    const cubeSize = 3;
    const dimension = 3;
    const cameraDistance = 10;

    scene = new THREE.Scene();
    setupRenderer();
    setupCamera(cubeSize, cameraDistance);

    setupControls();
    createFog(cubeSize, cameraDistance);
    
    // Debugging position and rotationof the cube
    // showAxes();

    var rubiksCube = new RubicksCube(cubeSize, dimension);
    rubiksCube.cubies.forEach(cubie => {
        scene.add(cubie.mesh);
    });

}

function animate() {
    controls.update();
	renderer.render(scene, camera);
}

function showAxes() {
    let axesHelper = new THREE.AxesHelper( 50 );
    scene.add(axesHelper);
}

function createFog(cubeSize, cameraDistance) {
    let color = 0x000000;
    let near = cameraDistance - (cubeSize * Math.sqrt(3)) / 2;
    let far = cameraDistance + (cubeSize * Math.sqrt(3)) / 2;
    scene.fog = new THREE.Fog(color, near, far);
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);
}

function setupCamera(cubeSize, cameraDistance) {
    let fov = 45;
    let aspect = window.innerWidth / window.innerHeight;
    let near = cameraDistance - (cubeSize * Math.sqrt(3)) / 2;
    let far = cameraDistance + (cubeSize * Math.sqrt(3)) / 2;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    let cameraPosition = cameraDistance / Math.sqrt(3);
    camera.position.set(cameraPosition, cameraPosition, cameraPosition);
}

function setupControls() {
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2;
    controls.noZoom = true;
    controls.noPan = true;
}
