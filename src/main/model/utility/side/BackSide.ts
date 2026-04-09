import {Side} from "./Side"
import {Vector} from "../../geometry/Vector"

export class BackSide extends Side {

    private static instance: BackSide

    private constructor() {
        super()
    }

    public static get(): BackSide {
        if(!BackSide.instance) {
            BackSide.instance = new BackSide()
        }
        return BackSide.instance
    }

    index(): number {
        return 5
    }

    getNormal(): Vector {
        return new Vector(0, 0, -1)
    }
}
