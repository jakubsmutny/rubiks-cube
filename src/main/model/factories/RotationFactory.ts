import {Axis} from "../geometry/Axis";
import {Vector} from "../geometry/Vector";
import {Rotation} from "../geometry/Rotation";

export class RotationFactory {

    static getDefaultRotation(): Rotation {
        const xAxis: Vector = new Vector(1, 0, 0)
        const yAxis: Vector = new Vector(0, 1, 0)
        const zAxis: Vector = new Vector(0, 0, 1)
        return new Rotation(xAxis, yAxis, zAxis)
    }

    static getRotation(axis: Axis, clockwiseSteps: number): Rotation {
        let product: Rotation = RotationFactory.getDefaultRotation();

        let rotation: Rotation = this.getDefaultRotation()
        if(axis === Axis.X) rotation = this.getRoll()
        if(axis === Axis.Y) rotation = this.getPitch()
        if(axis === Axis.Z) rotation = this.getYaw()

        clockwiseSteps = Math.floor(clockwiseSteps + 4) % 4
        for(let i: number = 0; i < clockwiseSteps; i++) {
            product = rotation.appliedToRotation(product);
        }
        return product
    }

    static getRoll(): Rotation {
        const xAxis: Vector = new Vector(1, 0, 0)
        const yAxis: Vector = new Vector(0, 0, 1)
        const zAxis: Vector = new Vector(0, -1, 0)
        return new Rotation(xAxis, yAxis, zAxis)
    }

    static getPitch(): Rotation {
        const xAxis: Vector = new Vector(0, 0, -1)
        const yAxis: Vector = new Vector(0, 1, 0)
        const zAxis: Vector = new Vector(1, 0, 0)
        return new Rotation(xAxis, yAxis, zAxis)
    }

    static getYaw(): Rotation {
        const xAxis: Vector = new Vector(0, 1, 0)
        const yAxis: Vector = new Vector(-1, 0, 0)
        const zAxis: Vector = new Vector(0, 0, 1)
        return new Rotation(xAxis, yAxis, zAxis)
    }
}