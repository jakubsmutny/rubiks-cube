import * as THREE from 'three';

export class Face {

    sideId;
    stickerProvider;
    visible;

    normal;

    constructor(sideId, stickerProvider, visible) {
        this.sideId = sideId;
        this.visible = visible;
        this.stickerProvider = stickerProvider;

        this.normal = this.#getNormal(sideId);
    }

    rotate(axis, radians) {
        this.normal.applyAxisAngle(axis, radians);
        this.normal.normalize();
    }

    getStickerTexture() {
        return this.stickerProvider.getStickerTexture(this.sideId);
    }

    #getNormal(sideId) {
        let normals = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1)
        ];
        return normals[sideId];
    }
}