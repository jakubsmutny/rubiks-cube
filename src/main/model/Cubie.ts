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

    inAxisLayers(axis: Vector, layers: Array<number>): boolean {
        return layers.includes(this.layerInAxis(axis))
    }

    layerInAxis(axis: Vector): number {
        if(axis.equals(Axis.X)) return this.position.i
        if(axis.equals(Axis.Y)) return this.position.j
        if(axis.equals(Axis.Z)) return this.position.k
        return -1
    }
}
