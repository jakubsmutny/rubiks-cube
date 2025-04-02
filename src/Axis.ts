import * as THREE from 'three';

export class Axis {
    static readonly X = new THREE.Vector3(1, 0, 0);
    static readonly Y = new THREE.Vector3(0, 1, 0);
    static readonly Z = new THREE.Vector3(0, 0, 1);
    static readonly undefined = new THREE.Vector3(0, 0, 0);
}
