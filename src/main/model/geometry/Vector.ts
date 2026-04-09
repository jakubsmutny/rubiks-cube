import {Side} from "../utility/side/Side"
import {Axis} from "./Axis";
import {SideFactory} from "../factories/SideFactory";

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

    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y + this.z * other.z
    }

    cross(other: Vector): Vector {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        )
    }

    snappedToGrid(exclude?: Vector): Vector {
        const sides = SideFactory.getAll()
            .map(side => side.getNormal())
            .filter(side => !exclude || side.dot(exclude) === 0)
        let maxDot = -Infinity
        let maxDotSide: Vector = new Vector(0, 0, 0)
        for(let side of sides)
            if(side.dot(this) > maxDot) {
                maxDot = side.dot(this)
                maxDotSide = side
            }
        return maxDotSide.clone()
    }
}
