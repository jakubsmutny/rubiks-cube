import {Vector} from "./Vector";

export class Axis {
    static readonly X = new Vector(1, 0, 0)
    static readonly Y = new Vector(0, 1, 0)
    static readonly Z = new Vector(0, 0, 1)
    static readonly undefined = new Vector(0, 0, 0)
}
