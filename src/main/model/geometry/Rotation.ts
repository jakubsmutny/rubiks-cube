import {Vector} from "./Vector";
import {Axis} from "./Axis";

export class Rotation {

    private xAxis: Vector
    private yAxis: Vector
    private zAxis: Vector

    constructor(xAxis: Vector, yAxis: Vector, zAxis: Vector) {
        this.xAxis = xAxis.clone()
        this.yAxis = yAxis.clone()
        this.zAxis = zAxis.clone()
    }

    clone(): Rotation {
        const rotation = new Rotation(this.xAxis, this.yAxis, this.zAxis)
        rotation.xAxis = this.xAxis.clone()
        rotation.yAxis = this.yAxis.clone()
        rotation.zAxis = this.zAxis.clone()
        return rotation
    }

    appliedToRotation(original: Rotation): Rotation {
        let rotation = original.clone()
        this.appliedToVector(rotation.xAxis)
        this.appliedToVector(rotation.yAxis)
        this.appliedToVector(rotation.zAxis)
        return rotation
    }

    appliedToVector(original: Vector): Vector {
        const x: number = original.x * this.xAxis.x + original.y * this.yAxis.x + original.z * this.zAxis.x
        const y: number = original.x * this.xAxis.y + original.y * this.yAxis.y + original.z * this.zAxis.y
        const z: number = original.x * this.xAxis.z + original.y * this.yAxis.z + original.z * this.zAxis.z
        return new Vector(x, y, z)
    }
}
