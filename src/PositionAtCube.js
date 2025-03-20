import * as THREE from 'three';

export class PositionAtCube {

    vector;
    rotation;

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
        this.rotation = new THREE.Quaternion();
    }

    move(axis, radians) {
        this.vector.applyAxisAngle(axis, radians);
        let moveQuaternion = new THREE.Quaternion();
        moveQuaternion.setFromAxisAngle(axis, radians);
        this.rotation.premultiply(moveQuaternion);
    }

    inPlane(axis, plane) {
        if(plane >= this.dimension) return false;
        let component = this.vector.dot(axis);
        let coord = (component + this.offset) / this.cubieSize;
        if(coord.toFixed(3) == plane) return true;
        return false;
    }

}
