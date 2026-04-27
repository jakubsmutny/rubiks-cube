import {SolveMethod} from "./SolveMethod"
import {Displayable} from "../display/Displayable"
import {Text} from "../display/Text"
import {Heading} from "../display/Heading"
import {Notation} from "../display/Notation"
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
        return [new Heading("Solving tutorial with Hints"),
            new Text("Hit the Scramble button to start solving with Hints!"),
            new Heading("Notation"),
            new Notation("R U R' U'"),
            new Text("If you see this, you can rotate the cube directly with mouse or touch according to the [Rubik's cube notation](https://ruwix.com/the-rubiks-cube/notation), or just click on the notation and let the cube rotate for you."),
            new Text("You can also enter notation in the text box above, be aware that moves applied by notation are always relative to the cube's orientation."),
            new Heading("Credits"),
            new Text("The app was created by [Jakub Smutný](https://jakubsmutny.cz) as bachelor thesis on [FIT CTU](https://fit.cvut.cz/en). Source code is available on [GitHub](https://github.com/jakubsmutny/rubiks-cube).")]
    }
}
