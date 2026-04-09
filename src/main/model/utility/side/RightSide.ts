import {Side} from "./Side"
import {Vector} from "../../geometry/Vector"

export class RightSide extends Side {

    private static instance: RightSide

    private constructor() {
        super()
    }

    public static get(): RightSide {
        if(!RightSide.instance) {
            RightSide.instance = new RightSide()
        }
        return RightSide.instance
    }

    index(): number {
        return 0
    }

    getNormal(): Vector {
        return new Vector(1, 0, 0)
    }
}
