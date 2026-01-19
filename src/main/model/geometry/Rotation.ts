import {Vector} from "./Vector";

export class Rotation {

    readonly xAxis: Vector
    readonly yAxis: Vector
    readonly zAxis: Vector

    constructor(xAxis: Vector, yAxis: Vector, zAxis: Vector) {
        this.xAxis = xAxis.clone()
        this.yAxis = yAxis.clone()
        this.zAxis = zAxis.clone()
    }

    clone(): Rotation {
        return new Rotation(this.xAxis.clone(), this.yAxis.clone(), this.zAxis.clone())
    }

    appliedToRotation(original: Rotation): Rotation {
        const xAxis: Vector = this.appliedToVector(original.xAxis)
        const yAxis: Vector = this.appliedToVector(original.yAxis)
        const zAxis: Vector = this.appliedToVector(original.zAxis)
        return new Rotation(xAxis, yAxis, zAxis)
    }

    appliedToVector(original: Vector): Vector {
        const x: number = original.x * this.xAxis.x + original.y * this.yAxis.x + original.z * this.zAxis.x
        const y: number = original.x * this.xAxis.y + original.y * this.yAxis.y + original.z * this.zAxis.y
        const z: number = original.x * this.xAxis.z + original.y * this.yAxis.z + original.z * this.zAxis.z
        return new Vector(x, y, z)
    }
}
