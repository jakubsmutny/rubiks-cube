import * as THREE from 'three';

export class PositionAtCube {

    vector: THREE.Vector3;
    rotation: THREE.Quaternion;

    size: number;
    dimension: number;
    cubieSize: number;
    offset: number;

    constructor(x: number, y: number, z: number, size: number, dimension: number) {
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

    copy(other: PositionAtCube): void {
        this.vector.copy(other.vector);
        this.rotation.copy(other.rotation);
        this.size = other.size;
        this.dimension = other.dimension;
        this.cubieSize = other.cubieSize;
        this.offset = other.offset;
    }

    clone(): PositionAtCube {
        let createdPosition = new PositionAtCube(0, 0, 0, 1, 1);
        createdPosition.copy(this);
        return createdPosition;
    }

    move(axis: THREE.Vector3, radians: number): void {
        this.vector.applyAxisAngle(axis, radians);
        let moveQuaternion = new THREE.Quaternion();
        moveQuaternion.setFromAxisAngle(axis, radians);
        this.rotation.premultiply(moveQuaternion);
    }

    inPlanes(axis: THREE.Vector3, planes: Array<number>): boolean {
        for (let plane of planes) {
            if(plane < 0 || plane >= this.dimension) continue;
            let component = this.vector.dot(axis);
            let coord = (component + this.offset) / this.cubieSize;
            if(+coord.toFixed(3) == plane) return true;
        }
        return false;
    }
}
