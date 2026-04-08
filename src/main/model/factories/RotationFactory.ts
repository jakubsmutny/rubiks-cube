import * as THREE from 'three'
import {Axis} from "../geometry/Axis"
import {Vector} from "../geometry/Vector"
import {Rotation} from "../geometry/Rotation"

export class RotationFactory {

    static getDefaultRotation(): Rotation {
        const xAxis: Vector = new Vector(1, 0, 0)
        const yAxis: Vector = new Vector(0, 1, 0)
        const zAxis: Vector = new Vector(0, 0, 1)
        return new Rotation(xAxis, yAxis, zAxis)
    }

    static getRotation(axis: Vector, clockwiseSteps: number): Rotation {
        let product: Rotation = RotationFactory.getDefaultRotation()

        let rotation: Rotation = RotationFactory.getDefaultRotation()
        if(axis.equals(Axis.X)) rotation = RotationFactory.getRoll()
        if(axis.equals(Axis.Y)) rotation = RotationFactory.getPitch()
        if(axis.equals(Axis.Z)) rotation = RotationFactory.getYaw()

        clockwiseSteps = Math.floor(clockwiseSteps + 4) % 4
        for(let i: number = 0; i < clockwiseSteps; i++) {
            product = rotation.appliedToRotation(product)
        }
        return product
    }

    static getRotationFromMatrixWorld(m: THREE.Matrix4) {
        const vectorX = new Vector(m.elements[0], m.elements[4], m.elements[8])
        const vectorY = new Vector(m.elements[1], m.elements[5], m.elements[9])
        const vectorZ = new Vector(m.elements[2], m.elements[6], m.elements[10])
        return new Rotation(vectorX, vectorY, vectorZ)
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