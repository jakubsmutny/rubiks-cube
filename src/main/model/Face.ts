import {Vector} from "./geometry/Vector";
import {Side} from "./utility/side/Side";
import {Rotation} from "./geometry/Rotation";

export class Face {

    side: Side
    normal: Vector

    constructor(side: Side) {
        this.side = side
        this.normal = side.getNormal()
    }

    isSolved(): boolean {
        return this.normal.equals(this.side.getNormal())
    }

    rotate(rotation: Rotation): void {
        this.normal = rotation.appliedToVector(this.normal)
    }
}
