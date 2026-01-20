import {Face} from "../Face";
import {CubePosition} from "../utility/CubePosition"
import {LeftSide} from "../utility/side/LeftSide"
import {DownSide} from "../utility/side/DownSide"
import {BackSide} from "../utility/side/BackSide"
import {RightSide} from "../utility/side/RightSide"
import {UpSide} from "../utility/side/UpSide"
import {FrontSide} from "../utility/side/FrontSide"

export class FaceFactory {

    static createFaces(position: CubePosition, dimension: number): Array<Face> {
        let faces: Array<Face> = Array<Face>()
        if(position.i == 0) faces.push(new Face(LeftSide.getInstance(), true))
        if(position.j == 0) faces.push(new Face(DownSide.getInstance(), true))
        if(position.k == 0) faces.push(new Face(BackSide.getInstance(), true))
        if(position.i == dimension - 1) faces.push(new Face(RightSide.getInstance(), true))
        if(position.j == dimension - 1) faces.push(new Face(UpSide.getInstance(), true))
        if(position.k == dimension - 1) faces.push(new Face(FrontSide.getInstance(), true))
        return faces
    }
}
