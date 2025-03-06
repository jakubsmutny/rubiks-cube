import * as THREE from 'three';

import {ColorPicker} from "./ColorPicker.js";

export class Cubie {
    
    size;
    positionX; positionY; positionZ;
    geometry;
    materials;
    mesh;

    constructor(size, positionX, positionY, positionZ) {
        this.size = size;
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;

        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.materials = [
                new THREE.MeshBasicMaterial( { color: ColorPicker.RIGHT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.LEFT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.UP } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.DOWN } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.FRONT } ),
                new THREE.MeshBasicMaterial( { color: ColorPicker.BACK } ),
            ];
        this.mesh = new THREE.Mesh( this.geometry, this.materials );
        this.mesh.position.set(positionX, positionY, positionZ);
    }

}
