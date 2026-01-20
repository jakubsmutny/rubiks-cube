import {Vector} from "./geometry/Vector";
import {Side} from "./utility/side/Side";
import {Rotation} from "./geometry/Rotation";

export class Face {

    side: Side
    normal: Vector

    visible: boolean

    constructor(side: Side, visible: boolean) {
        this.side = side
        this.normal = side.getNormal()
        this.visible = visible
    }

    rotate(rotation: Rotation): void {
        this.normal = rotation.appliedToVector(this.normal)
    }
}
