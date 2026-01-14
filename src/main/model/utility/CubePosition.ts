import {Rotation} from "../geometry/Rotation";
import {RotationFactory} from "../factories/RotationFactory";

export class CubePosition {

    readonly i: Number
    readonly j: Number
    readonly k: Number
    readonly rotation: Rotation

    constructor(i: Number, j: Number, k: Number) {
        this.i = i;
        this.j = j;
        this.k = k;
        this.rotation = RotationFactory.getDefaultRotation()
    }
}
