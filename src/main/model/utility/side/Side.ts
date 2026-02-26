import {Vector} from "../../geometry/Vector";
import {RightSide} from "./RightSide";
import {LeftSide} from "./LeftSide";
import {UpSide} from "./UpSide";
import {DownSide} from "./DownSide";
import {FrontSide} from "./FrontSide";
import {BackSide} from "./BackSide";

export interface Side {
    index(): number
    getNormal(): Vector
}

export namespace Side {
    export function getAll(): Array<Side> {
        // Order matters here
        return Array.of(
            RightSide.getInstance(),
            LeftSide.getInstance(),
            UpSide.getInstance(),
            DownSide.getInstance(),
            FrontSide.getInstance(),
            BackSide.getInstance()
        )
    }
}
