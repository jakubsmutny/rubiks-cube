import {Vector} from "../../geometry/Vector"
import {RightSide} from "./RightSide"
import {LeftSide} from "./LeftSide"
import {UpSide} from "./UpSide"
import {DownSide} from "./DownSide"
import {FrontSide} from "./FrontSide"
import {BackSide} from "./BackSide"

export abstract class Side {
    abstract index(): number
    abstract getNormal(): Vector

    equals(other: Side): boolean {
        return this.index() === other.index()
    }
}
