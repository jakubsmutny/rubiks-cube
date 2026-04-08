import * as THREE from 'three'
import {Move} from "../model/manipulation/Move"
import {Shuffle} from "../model/manipulation/Shuffle"
import {Axis} from "../model/geometry/Axis"
import {Rotation} from "../model/geometry/Rotation"
import {RotationFactory} from "../model/factories/RotationFactory"
import {Vector} from "../model/geometry/Vector"

export class CameraMoveTranslator {

    camera: THREE.PerspectiveCamera
    rotation: Rotation

    dimension: number

    constructor(camera: THREE.PerspectiveCamera, dimension: number) {
        this.camera = camera
        this.dimension = dimension
        this.rotation = this.getSnappedRotation()
    }

    getSnappedRotation(): Rotation {
        const rotation = RotationFactory.getRotationFromMatrixWorld(this.camera.matrixWorld)
        return rotation.snappedToGrid()
    }

    translateShuffle(shuffle: Shuffle): Shuffle {
        const moves: Array<Move> = new Array<Move>()
        for(let move of shuffle.moves)
            moves.push(this.translateMove(move))
        return new Shuffle(moves, shuffle.fast)
    }

    translateMove(move: Move): Move {
        this.rotation = this.getSnappedRotation()
        const direction: Vector = this.rotation.appliedToVector(move.axis)
        const negative = Axis.isNegative(direction)
        const newAxis = negative ? direction.negative() : direction
        const newPlanes = negative ?
            move.planes.map(plane => this.dimension - (plane + 1)) :
            Array.from(move.planes)
        const newSteps = move.steps * (negative ? -1 : 1)
        return new Move(newAxis, newPlanes, newSteps)
    }
}
