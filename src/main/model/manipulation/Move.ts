import { Axis } from '../geometry/Axis'
import {Vector} from "../geometry/Vector";

export class Move {

    axis: Vector;
    planes: Array<number>;
    steps: number;

    constructor(axis: Vector, planes: Array<number>, steps: number) {
        this.axis = axis
        this.planes = Array.from(planes)
        this.planes.sort()
        this.steps = Move.normalizeSteps(steps)
    }

    clone(): Move {
        const planes: Array<number> = Array.from(this.planes)
        return new Move(this.axis.clone(), planes, this.steps)
    }

    getInverse(): Move {
        const planes: Array<number> = Array.from(this.planes)
        const inverseSteps: number = Move.normalizeSteps(-this.steps)
        return new Move(this.axis.clone(), planes, inverseSteps)
    }

    getPositiveSteps(): number {
        return this.steps > 0 ? this.steps : this.steps + 4
    }

    isConcatenableWith(other: Move): boolean {
        if(this.axis != other.axis) {
            return false
        }
        this.planes.sort()
        other.planes.sort()
        return this.planes.every(
            (plane, index) => plane === other.planes[index]
        )
    }

    concatenate(other: Move): Move {
        if(!this.isConcatenableWith(other)) {
            return this.clone()
        }
        const planes: Array<number> = Array.from(this.planes)
        const steps: number = Move.normalizeSteps(this.steps + other.steps)
        return new Move(this.axis.clone(), planes, steps)
    }

    private static normalizeSteps(steps: number): number {
        steps = Math.trunc(steps)
        return this.reduceTurn(steps)
    }

    static reduceTurn(turnSize: number): number {
        turnSize = ((turnSize % 4) + 4) % 4
        if(turnSize > 2) turnSize -= 4
        return turnSize
    }

    isEmpty(): boolean {
        return this.axis === Axis.undefined
            || this.planes.length === 0
            || this.steps === 0
    }
}
