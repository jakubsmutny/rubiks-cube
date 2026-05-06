import {Side} from "../side/Side"
import {RightSide} from "../side/RightSide"
import {LeftSide} from "../side/LeftSide"
import {UpSide} from "../side/UpSide"
import {DownSide} from "../side/DownSide"
import {FrontSide} from "../side/FrontSide"
import {BackSide} from "../side/BackSide"

export class SideFactory {
    static getAll(): Array<Side> {
        // Order matters here
        return [
            RightSide.get(),
            LeftSide.get(),
            UpSide.get(),
            DownSide.get(),
            FrontSide.get(),
            BackSide.get()
        ]
    }
}
