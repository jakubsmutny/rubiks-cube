import {Side} from "./Side"
import {Vector} from "../../geometry/Vector"

export class LeftSide extends Side {

    private static instance: LeftSide

    private constructor() {
        super()
    }

    public static get(): LeftSide {
        if(!LeftSide.instance) {
            LeftSide.instance = new LeftSide()
        }
        return LeftSide.instance
    }

    index(): number {
        return 1
    }

    getNormal(): Vector {
        return new Vector(-1, 0, 0)
    }
}
