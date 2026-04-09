export interface SolveMethod {
    start(): void
    update(): void
    finished(): boolean
}
