import {Side} from "./Side"
import {Vector} from "../../geometry/Vector"

export class UpSide extends Side {

    private static instance: UpSide

    private constructor() {
        super()
    }

    public static get(): UpSide {
        if(!UpSide.instance) {
            UpSide.instance = new UpSide()
        }
        return UpSide.instance
    }

    index(): number {
        return 2
    }

    getNormal(): Vector {
        return new Vector(0, 1, 0)
    }
}
