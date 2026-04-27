import {SolveMethod} from "./SolveMethod"
import {Displayable} from "../display/Displayable"
import {DisplayableText} from "../display/DisplayableText"
import {DisplayableHeading} from "../display/DisplayableHeading"
import {DisplayableNotation} from "../display/DisplayableNotation"
import {CubeModel} from "../CubeModel";

export class EmptyMethod implements SolveMethod {

    cubeModel: CubeModel

    constructor(cubeModel: CubeModel) {
        this.cubeModel = cubeModel
    }

    start(): void {}

    update(): void {}

    finished(): boolean {
        return true
    }

    getHint(): Array<Displayable> {
        return [new DisplayableHeading("Solving tutorial with Hints"),
            new DisplayableText("Hit the Scramble button to start solving with Hints!"),
            new DisplayableHeading("Notation"),
            new DisplayableNotation("R U R' U'"),
            new DisplayableText("If you see this, you can rotate the cube directly with mouse or touch according to the [Rubik's cube notation](https://ruwix.com/the-rubiks-cube/notation), or just click on the notation and let the cube rotate for you."),
            new DisplayableText("You can also enter notation in the text box above, be aware that moves applied by notation are always relative to the cube's orientation."),
            new DisplayableHeading("Credits"),
            new DisplayableText("The app was created by [Jakub Smutný](https://jakubsmutny.cz) as bachelor thesis on [FIT CTU](https://fit.cvut.cz/en). Source code is available on [GitHub](https://github.com/jakubsmutny/rubiks-cube).")]
    }
}
