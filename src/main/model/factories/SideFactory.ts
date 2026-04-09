import {Side} from "../utility/side/Side"
import {RightSide} from "../utility/side/RightSide"
import {LeftSide} from "../utility/side/LeftSide"
import {UpSide} from "../utility/side/UpSide"
import {DownSide} from "../utility/side/DownSide"
import {FrontSide} from "../utility/side/FrontSide"
import {BackSide} from "../utility/side/BackSide"

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
