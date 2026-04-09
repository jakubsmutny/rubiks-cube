import {Side} from "./Side"
import {Vector} from "../../geometry/Vector"

export class FrontSide extends Side {

    private static instance: FrontSide

    private constructor() {
        super()
    }

    public static get(): FrontSide {
        if(!FrontSide.instance) {
            FrontSide.instance = new FrontSide()
        }
        return FrontSide.instance
    }

    index(): number {
        return 4
    }

    getNormal(): Vector {
        return new Vector(0, 0, 1)
    }
}
