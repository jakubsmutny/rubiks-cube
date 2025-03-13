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
        this.updateFromPosition();
    }

    #getMaterial() {
        let loader = new THREE.TextureLoader();

        let material = [];
        for (let i = 0; i < 6; i++)
            material.push(new THREE.MeshBasicMaterial( { color: 0x000000 } ))
        
        for (let face of this.faces)
            material[face.directionIndex] = new THREE.MeshBasicMaterial( { map: loader.load(face.sticker) } );
        
        return material;
    }

    updateFromPosition() {
        this.graphics.position.copy(this.position.vector);
        this.graphics.rotation.copy(this.position.euler);
    }
}
