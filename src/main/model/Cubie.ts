import {CubePosition} from "./utility/CubePosition"
import {Face} from "./Face"

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
}
