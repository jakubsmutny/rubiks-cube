import {Displayable, DisplayableType} from "./Displayable";

export class Heading implements Displayable {

    contents: string
    type: DisplayableType

    constructor(contents: string) {
        this.contents = contents
        this.type = 'heading'
    }

    getContents(): string {
        return this.contents
    }

    getType(): DisplayableType {
        return this.type
    }
}
