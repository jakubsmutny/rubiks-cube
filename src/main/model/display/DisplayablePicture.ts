import {Displayable, DisplayableType} from "./Displayable"

export class DisplayablePicture implements Displayable {

    contents: string
    type: DisplayableType

    constructor(contents: string) {
        this.contents = contents
        this.type = 'picture'
    }

    getContents(): string {
        return this.contents
    }

    getType(): DisplayableType {
        return this.type
    }
}
