import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { RubicksCube } from './RubicksCube.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;

const size = 3;
const dimension = 3;
const cameraDistance = 6;

const rubiksCube = new RubicksCube(size, dimension);

rubiksCube.cubies.forEach(cubie => {
    scene.add(cubie.mesh);
});

//const axesHelper = new THREE.AxesHelper( 50 );
//scene.add( axesHelper );

const near = cameraDistance - (size * Math.sqrt(3)) / 2;
const far = cameraDistance + (size * Math.sqrt(3)) / 2;
scene.fog = new THREE.Fog(0x000000, near, far);

const cameraPosition = cameraDistance / Math.sqrt(3);
camera.position.set(cameraPosition, cameraPosition, cameraPosition);
controls.update();

function animate() {

    controls.update();
	renderer.render( scene, camera );

}
