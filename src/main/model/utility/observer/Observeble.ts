import {Observer} from "./Observer";
import {Move} from "../../manipulation/Move";

export interface Observable {
    register(observer: Observer): void
    notify(move: Move): void
}
