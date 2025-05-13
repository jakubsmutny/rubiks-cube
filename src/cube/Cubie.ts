import * as THREE from 'three';

import { PositionAtCube } from './PositionAtCube';
import { Face } from './Face';
import { StickerProvider } from './StickerProvider';

export class Cubie {
    
    position: PositionAtCube;
    faces: Array<Face>;
    stickerProvider: StickerProvider;

    graphics: THREE.Mesh;
    originalPosition: PositionAtCube;

    constructor(position: PositionAtCube, faces: Array<Face>, stickerProvider: StickerProvider) {
        this.position = position;
        this.faces = faces;
        this.stickerProvider = stickerProvider;

        let size = this.position.cubieSize;
        let geometry = new THREE.BoxGeometry(size, size, size);
        let materials = this.#getMaterial();

        this.graphics = new THREE.Mesh(geometry, materials);
        this.#updateFromPosition();

        this.originalPosition = position.clone();
    }

    #getMaterial(): Array<THREE.MeshBasicMaterial> {
        let material = Array<THREE.MeshBasicMaterial>();
        // Default to Background Color
        for (let i = 0; i < 6; i++)
            material.push(new THREE.MeshBasicMaterial({color: this.stickerProvider.getBackgroundColor()}));
        // Draw Stickers only on visible Faces
        for (let face of this.faces)
            material[face.sideId] = new THREE.MeshBasicMaterial({map: this.stickerProvider.getStickerTexture(face.sideId)});
        return material;
    }

    move(axis: THREE.Vector3, radians: number): void {
        this.position.move(axis, radians);
        for (let face of this.faces)
            face.rotate(axis, radians);
        this.#updateFromPosition();
    }

    #updateFromPosition(): void {
        this.graphics.position.copy(this.position.vector);
        let euler = new THREE.Euler().setFromQuaternion(this.position.rotation);
        this.graphics.rotation.copy(euler);
    }

    reset(): void {
        this.position.copy(this.originalPosition);
        for (let face of this.faces) face.resetNormal();
        this.#updateFromPosition();
    }
}
