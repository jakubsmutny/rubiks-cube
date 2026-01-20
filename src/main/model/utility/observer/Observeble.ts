import {Observer} from "./Observer";

export interface Observable {
    register(observer: Observer): void
    notify(): void
}
