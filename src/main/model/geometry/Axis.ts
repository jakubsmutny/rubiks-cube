import {Vector} from "./Vector";

export class Axis {
    static readonly X = new Vector(1, 0, 0)
    static readonly Y = new Vector(0, 1, 0)
    static readonly Z = new Vector(0, 0, 1)
    static readonly undefined = new Vector(0, 0, 0)

    static getOrthogonal(vector: Vector): [Vector, Vector] {
        if(vector.equals(Axis.X) || vector.negative().equals(Axis.X)) return [Axis.Y, Axis.Z]
        if(vector.equals(Axis.Y) || vector.negative().equals(Axis.Y)) return [Axis.X, Axis.Z]
        if(vector.equals(Axis.Z) || vector.negative().equals(Axis.Z)) return [Axis.X, Axis.Y]
        return [Axis.undefined, Axis.undefined]
    }
}
