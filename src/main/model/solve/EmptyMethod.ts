import {SolveMethod} from "./SolveMethod"

export class EmptyMethod implements SolveMethod {

    constructor() {}

    start(): void {}

    update(): void {}

    finished(): boolean {
        return true
    }
}
