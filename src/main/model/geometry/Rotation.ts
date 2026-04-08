import {Vector} from "./Vector";
import {Axis} from "./Axis";

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

    snappedToGrid(): Rotation {
        const snappedX: Vector = this.xAxis.snappedToGrid()
        const snappedY: Vector = this.yAxis.snappedToGrid(snappedX)
        const snappedZ: Vector = snappedX.cross(snappedY)
        return new Rotation(snappedX, snappedY, snappedZ)
    }

    transposed(): Rotation {
        return new Rotation(new Vector(this.xAxis.x, this.yAxis.x, this.zAxis.x),
                            new Vector(this.xAxis.y, this.yAxis.y, this.zAxis.y),
                            new Vector(this.xAxis.z, this.yAxis.z, this.zAxis.z))
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
