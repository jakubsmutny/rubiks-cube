import {Displayable, DisplayableType} from "./Displayable";

export class DisplayableText implements Displayable {

    contents: string
    type: DisplayableType

    constructor(contents: string) {
        this.contents = contents
        this.type = 'text'
    }

    getContents(): string {
        return this.contents
    }

    getType(): DisplayableType {
        return this.type
    }
}
