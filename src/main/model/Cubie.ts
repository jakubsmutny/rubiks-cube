import {CubePosition} from "./utility/CubePosition"
import {Face} from "./Face"
import {Move} from "./manipulation/Move";

export class Cubie {

    position: CubePosition
    faces: Array<Face>

    constructor(position: CubePosition, faces: Array<Face>) {
        this.position = position
        this.faces = faces
    }

    isSolved(): boolean {
        return this.faces.every(face => face.isSolved())
    }

    manipulate(move: Move): void {
        if(!this.position.isAffectedBy(move)) {
            return
        }
        this.position = this.position.apply(move)
    }
}
