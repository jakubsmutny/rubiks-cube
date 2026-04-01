import {Move} from "../../manipulation/Move";

export interface Observer {
    updateFromObservable(move: Move, speed: number): void
}
