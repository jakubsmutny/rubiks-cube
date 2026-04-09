export class EmptyMethod implements SolveMethod {

    constructor() {}

    start(): void {}

    update(): void {}

    finished(): boolean {
        return true
    }
}
