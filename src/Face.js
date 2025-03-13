import * as THREE from 'three';

import { ColorIndex } from './ColorIndex.js';
import { Axis } from './Axis.js';

export class Face {

    sticker;
    normal;

    directionIndex;
    visible;

    constructor(directionIndex, visible) {
        this.directionIndex = directionIndex;
        this.visible = visible;

        this.sticker = this.#getSticker(directionIndex);
        this.normal = this.#getNormal(directionIndex);
    }

    //rotate(axis, radians) {
    //    let axisVector;
    //    if(axis == Axis.X) axisVector = new THREE.Vector3(1, 0, 0);
    //    if(axis == Axis.Y) axisVector = new THREE.Vector3(0, 1, 0);
    //    if(axis == Axis.Z) axisVector = new THREE.Vector3(0, 0, 1);
    //    this.normal.applyAxisAngle(axisVector, radians);
    //}

    #getSticker(directionIndex) {
        if(!this.visible) return '../cubefaces/blank.png';
        let stickers = [
            '../cubefaces/red.png',
            '../cubefaces/orange.png',
            '../cubefaces/white.png',
            '../cubefaces/yellow.png',
            '../cubefaces/green.png',
            '../cubefaces/blue.png'
        ];
        return stickers[directionIndex];
    }

    #getNormal(directionIndex) {
        let normals = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1)
        ]
        return normals[directionIndex];
    }
}