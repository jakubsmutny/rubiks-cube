import {Move} from "../../manipulation/Move";

export interface Observer {
    updateMove(move: Move, speed: number): void
    updateVisibility(): void
}
