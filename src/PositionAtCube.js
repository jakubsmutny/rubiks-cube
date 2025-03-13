import * as THREE from 'three';

import { Axis } from './Axis.js';

export class PositionAtCube {

    vector;
    euler;

    size;
    dimension;
    cubieSize;
    offset;

    constructor(x, y, z, size, dimension) {
        this.size = size;
        this.dimension = dimension;

        this.cubieSize = size / dimension;
        this.offset = (size - this.cubieSize) / 2;

        let coordX = x * this.cubieSize - this.offset;
        let coordY = y * this.cubieSize - this.offset;
        let coordZ = z * this.cubieSize - this.offset;

        this.vector = new THREE.Vector3(coordX, coordY, coordZ);
        this.euler = new THREE.Euler();
    }

    move(axis, radians) {
        let axisVector;
        if(axis == Axis.X) axisVector = new THREE.Vector3(1, 0, 0);
        if(axis == Axis.Y) axisVector = new THREE.Vector3(0, 1, 0);
        if(axis == Axis.Z) axisVector = new THREE.Vector3(0, 0, 1);
        this.vector.applyAxisAngle(axisVector, radians);
        
        let quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(this.euler);
        let rotateQ = new THREE.Quaternion();
        rotateQ.setFromAxisAngle ( axisVector , radians );
        quaternion.premultiply(rotateQ)
        this.euler.setFromQuaternion(quaternion);
    }

    inPlane(axis, plane) {
        if(plane >= this.dimension) return false;
        let component;
        if(axis == Axis.X) component = this.vector.x;
        if(axis == Axis.Y) component = this.vector.y;
        if(axis == Axis.Z) component = this.vector.z;
        let coord = (component + this.offset) / this.cubieSize;
        if(coord.toFixed(3) == plane) return true;
        return false;
    }

}
