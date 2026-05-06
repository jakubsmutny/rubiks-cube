import {Face} from "../../Face"
import {CubePosition} from "../CubePosition"
import {LeftSide} from "../side/LeftSide"
import {DownSide} from "../side/DownSide"
import {BackSide} from "../side/BackSide"
import {RightSide} from "../side/RightSide"
import {UpSide} from "../side/UpSide"
import {FrontSide} from "../side/FrontSide"

export class FaceFactory {

    static createFaces(position: CubePosition, dimension: number): Array<Face> {
        let faces: Array<Face> = Array<Face>()
        if(position.i == 0) faces.push(new Face(LeftSide.get(), true))
        if(position.j == 0) faces.push(new Face(DownSide.get(), true))
        if(position.k == 0) faces.push(new Face(BackSide.get(), true))
        if(position.i == dimension - 1) faces.push(new Face(RightSide.get(), true))
        if(position.j == dimension - 1) faces.push(new Face(UpSide.get(), true))
        if(position.k == dimension - 1) faces.push(new Face(FrontSide.get(), true))
        return faces
    }
}
