import * as THREE from 'three';

import {ColorPicker} from "./ColorPicker.js";

export class Cubie {
    
    size;
    offsetX; offsetY; offsetZ;
    geometry;
    materials;
    mesh;

    constructor(size, offsetX, offsetY, offsetZ) {
        this.size = size;
        this.offsetX = this.offsetX;
        this.offsetY = this.offsetY;
        this.offsetZ = this.offsetZ;

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
        this.mesh.position.set(offsetX, offsetY, offsetZ);
    }

}
