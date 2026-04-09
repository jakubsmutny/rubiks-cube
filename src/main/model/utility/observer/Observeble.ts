import {Observer} from "./Observer";
import {Move} from "../../manipulation/Move";

export interface Observable {
    register(observer: Observer): void
    notifyMove(move: Move, speed: number): void
    notifyVisibility(): void
}
