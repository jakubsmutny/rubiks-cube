import * as THREE from "three";
import {Side} from "../../model/utility/side/Side"
import {LeftSide} from "../../model/utility/side/LeftSide"
import {RightSide} from "../../model/utility/side/RightSide"
import {UpSide} from "../../model/utility/side/UpSide"
import {DownSide} from "../../model/utility/side/DownSide"
import {FrontSide} from "../../model/utility/side/FrontSide"
import {BackSide} from "../../model/utility/side/BackSide"

export class ColorPicker {
    static readonly RED = new THREE.Color(185, 0, 0)
    static readonly ORANGE = new THREE.Color(255, 50, 0)
    static readonly WHITE = new THREE.Color(255, 255, 255)
    static readonly YELLOW = new THREE.Color(255, 213, 0)
    static readonly GREEN = new THREE.Color(0, 155, 32)
    static readonly BLUE = new THREE.Color(0, 69, 173)

    static readonly NON_VISIBLE = new THREE.Color(80, 80, 80)
    static readonly BACKGROUND = new THREE.Color(0, 0, 0)

    static getColor(side :Side): THREE.Color {
        switch(side.index()) {
            case RightSide.get().index(): return this.RED
            case LeftSide.get().index(): return this.ORANGE
            case UpSide.get().index(): return this.WHITE
            case DownSide.get().index(): return this.YELLOW
            case FrontSide.get().index(): return this.GREEN
            case BackSide.get().index(): return this.BLUE
            default: return this.BACKGROUND
        }
    }
}
