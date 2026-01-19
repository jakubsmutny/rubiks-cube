import {Rotation} from "./Rotation";

export class Vector {

    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone(): Vector {
        return new Vector(this.x, this.y, this.z);
    }

    equals(other: Vector): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }

    negative(): Vector {
        return new Vector(-this.x, -this.y, -this.z)
    }
}
