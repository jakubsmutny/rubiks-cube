import * as THREE from 'three';

export class Cubie {
    
    position;
    faces;
    graphics;

    constructor(position, faces) {
        this.position = position;
        this.faces = faces;

        let size = this.position.cubieSize;
        let geometry = new THREE.BoxGeometry(size, size, size);
        let materials = this.#getMaterial();

        this.graphics = new THREE.Mesh(geometry, materials);
        this.#updateFromPosition();
    }

    #getMaterial() {
        let material = [];
        for (let i = 0; i < 6; i++)
            material.push(new THREE.MeshBasicMaterial( { color: 0x000000 } ))
        
        for (let face of this.faces)
            material[face.sideId] = new THREE.MeshBasicMaterial( { map: face.getStickerTexture() } );
        
        return material;
    }

    move(axis, radians) {
        this.position.move(axis, radians);
        for (let face of this.faces)
            face.rotate(axis, radians);
        this.#updateFromPosition();
    }

    #updateFromPosition() {
        this.graphics.position.copy(this.position.vector);
        let euler = new THREE.Euler().setFromQuaternion(this.position.rotation);
        this.graphics.rotation.copy(euler);
    }
}
