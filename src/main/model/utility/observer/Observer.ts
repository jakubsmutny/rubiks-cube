import {Move} from "../../manipulation/Move";

export interface Observer {
    updateFromObservable(move: Move): void
}
