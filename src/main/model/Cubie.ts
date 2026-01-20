import {CubePosition} from "./utility/CubePosition"
import {Face} from "./Face"
import {Move} from "./manipulation/Move";
import {Rotation} from "./geometry/Rotation";
import {RotationFactory} from "./factories/RotationFactory";
import {Vector} from "./geometry/Vector";
import {Axis} from "./geometry/Axis";

export class Cubie {

    position: CubePosition
    faces: Array<Face>

    constructor(position: CubePosition, faces: Array<Face>) {
        this.position = position
        this.faces = faces
    }

    manipulate(move: Move): void {
        if(!this.position.isAffectedBy(move)) {
            return
        }
        this.position = this.position.apply(move)
        let rotation: Rotation = RotationFactory.getRotation(move.axis, move.getPositiveSteps())
        this.faces.forEach(face => face.rotate(rotation))
    }

    inAxisPlanes(axis: Vector, planes: Array<number>) {
        if(axis.equals(Axis.X) && planes.includes(this.position.i)) return true
        if(axis.equals(Axis.Y) && planes.includes(this.position.j)) return true
        if(axis.equals(Axis.Z) && planes.includes(this.position.k)) return true
        return false
    }
}
