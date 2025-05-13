import * as THREE from 'three';

export class Face {

    sideId: number;
    visible: boolean;

    normal: THREE.Vector3;

    constructor(sideId: number, visible: boolean) {
        this.sideId = sideId;
        this.visible = visible;

        this.normal = this.#getDefaultNormal();    }

    resetNormal() {
        this.normal = this.#getDefaultNormal();
    }

    #getDefaultNormal(): THREE.Vector3 {
        const normals: THREE.Vector3[] = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1)
        ];
        return normals[this.sideId];
    }

    rotate(axis: THREE.Vector3, radians: number): void {
        this.normal.applyAxisAngle(axis, radians);
        this.normal.normalize();
    }
}