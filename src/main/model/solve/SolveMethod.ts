import {Displayable} from "../utility/display/Displayable";

export interface SolveMethod {
    start(): void
    update(): void
    finished(): boolean
    getHint(): Array<Displayable>
}
