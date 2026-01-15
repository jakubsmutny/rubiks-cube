import {Rotation} from "../geometry/Rotation";
import {RotationFactory} from "../factories/RotationFactory";
import {Move} from "../manipulation/Move";
import {Axis} from "../geometry/Axis";

export class CubePosition {

    readonly dimension: number
    readonly i: number
    readonly j: number
    readonly k: number
    readonly rotation: Rotation

    constructor(dimension: number, i: number, j: number, k: number, rotation?: Rotation) {
        this.dimension = dimension
        this.i = i;
        this.j = j;
        this.k = k;
        if(rotation) {
            this.rotation = rotation
        } else {
            this.rotation = RotationFactory.getDefaultRotation()
        }
    }

    clone(): CubePosition {
        return new CubePosition(this.dimension, this.i, this.j, this.k, this.rotation.clone())
    }

    isAffectedBy(move: Move): boolean {
        return move.planes.includes(this.getAxisCoord(move.axis))
    }

    apply(move: Move): CubePosition {
        if(!this.isAffectedBy(move)) {
            return this.clone()
        }
        let rotation: Rotation = RotationFactory.getRotation(move.axis, move.getPositiveSteps())
        let rotationCoords: [number, number] = this.getRotatingCoords(move.axis)
        for(let s: number = 0; s < move.getPositiveSteps(); s++) {
            rotationCoords = this.rotateTwoCoords(rotationCoords)
        }
        const [i, j, k] = this.getReconstructedCoords(move.axis, rotationCoords)
        return new CubePosition(this.dimension, i, j, k, rotation.appliedToRotation(this.rotation))
    }

    private getAxisCoord(axis: Axis): number {
        let coord = -1
        if(axis === Axis.X) coord = this.i
        if(axis === Axis.Y) coord = this.j
        if(axis === Axis.Z) coord = this.k
        return coord
    }

    private getRotatingCoords(axis: Axis): [number, number] {
        let coords: [number, number] = [-1, -1]
        if(axis === Axis.X) coords = [this.j, this.k]
        if(axis === Axis.Y) coords = [this.k, this.i]
        if(axis === Axis.Z) coords = [this.i, this.j]
        return coords
    }

    private getReconstructedCoords(axis: Axis, rotatingCoords: [number, number]): [number, number, number] {
        if(axis === Axis.X) return [this.i, rotatingCoords[0], rotatingCoords[1]]
        if(axis === Axis.Y) return [rotatingCoords[1], this.j, rotatingCoords[0]]
        if(axis === Axis.Z) return [rotatingCoords[0], rotatingCoords[1], this.k]
        return [-1, -1, -1]
    }

    private getAxisRotation(axis: Axis): Rotation {
        let rotation: Rotation = RotationFactory.getDefaultRotation()
        if(axis === Axis.X) {rotation = RotationFactory.getRoll(); console.log("got Roll")}
        if(axis === Axis.Y) rotation = RotationFactory.getPitch()
        if(axis === Axis.Z) rotation = RotationFactory.getYaw()
        return rotation
    }

    private rotateTwoCoords([from, to]: [number, number]): [number, number] {
        return [this.dimension - (to + 1), from]
    }
}
