import {Vector} from "../../geometry/Vector";

export interface Side {
    index(): number
    getNormal(): Vector
}