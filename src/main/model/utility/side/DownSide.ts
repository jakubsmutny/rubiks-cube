import {Side} from "./Side";
import {Vector} from "../../geometry/Vector";

export class DownSide implements Side {

    private static instance: DownSide

    private constructor() {}

    public static getInstance(): DownSide {
        if(!DownSide.instance) {
            DownSide.instance = new DownSide()
        }
        return DownSide.instance
    }

    index(): number {
        return 3
    }

    getNormal(): Vector {
        return new Vector(0, -1, 0)
    }
}
