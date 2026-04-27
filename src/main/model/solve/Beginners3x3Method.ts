import {Face} from "../Face"
import {Cubie} from "../Cubie"
import {Side} from "../utility/side/Side"
import {UpSide} from "../utility/side/UpSide"
import {DownSide} from "../utility/side/DownSide"
import {Vector} from "../geometry/Vector"
import {CubeModel} from "../CubeModel"
import {SolveMethod} from "./SolveMethod"
import {Displayable} from "../display/Displayable"
import {Heading} from "../display/Heading"
import {Text} from "../display/Text"
import {Notation} from "../display/Notation"
import {Picture} from "../display/Picture";

enum Step {
    WhiteCross,
    WhiteEdgesRest,
    WhiteCorners,
    MiddleLayer,
    YellowCross,
    YellowCornerStickers,
    YellowCornerRest,
    YellowEdgesRest
}

export class Beginners3x3Method implements SolveMethod {

    activeStep: Step
    groups: Array<Array<Face>>

    cubeModel: CubeModel

    readonly totalSteps: number

    constructor(cubeModel: CubeModel) {
        this.totalSteps = Object.keys(Step).filter(k => isNaN(Number(k))).length
        this.activeStep = this.totalSteps
        this.groups = Array<Array<Face>>(this.totalSteps)
        for(let step = 0; step < this.totalSteps; step++)
            this.groups[step] = this.createGroup(step, cubeModel.cubies)
        this.cubeModel = cubeModel
    }

    start(): void {
        this.activeStep = 0
        for(let cubie of this.cubeModel.cubies) for(let face of cubie.faces)
            face.visible = false
        this.activeStepFaceGroup().forEach(face => face.visible = true)
        this.cubeModel.notifyMethodStep()
        this.update()
    }

    update(): void {
        while(this.stepFinished() && !this.finished()) {
            if(!this.finished()) this.activeStep++
            if(!this.finished())
                this.groups[this.activeStep].forEach(face => face.visible = true)
            this.cubeModel.notifyMethodStep()
        }
    }

    finished(): boolean {
        return this.activeStep === this.totalSteps
    }

    private activeStepFaceGroup(): Array<Face> {
        if(this.activeStep >= this.totalSteps) return Array<Face>()
        return this.groups[this.activeStep]
    }

    private stepFinished(): boolean {
        let normals = new Array<Vector>(6)
        for(let cubie of this.cubeModel.cubies) for(let face of cubie.faces) {
            if(!face.visible) continue
            if(!(face.side.index() in normals)) {
                normals[face.side.index()] = face.normal
                continue
            }
            if(!face.normal.equals(normals[face.side.index()])) {
                return false
            }
        }
        return true
    }

    private createGroup(step: Step, cubies: Array<Cubie>): Array<Face> {
        const group: Array<Face> = new Array<Face>()
        for(let cubie of cubies) for(let face of cubie.faces)
            if(this.isFaceInStep(step, face, cubie))
                group.push(face)
        return group
    }

    private isFaceInStep(step: Step, face: Face, cubie: Cubie): boolean {
        const center: boolean = cubie.faces.length === 1
        const edge: boolean = cubie.faces.length === 2
        const corner: boolean = cubie.faces.length === 3
        const faceOfSide = (sides: Array<Side>) =>
                sides.some(side =>
                    side.equals(face.side))
        const cubieOfSide = (sides: Array<Side>) =>
                sides.some(side =>
                    cubie.faces.some(face =>
                        face.side.equals(side)))
        const otherFaceOfSide = (sides: Array<Side>) =>
                !faceOfSide(sides) && cubieOfSide(sides)

        switch (step) {
            case Step.WhiteCross: return (center || edge) && faceOfSide([UpSide.get()])
            case Step.WhiteEdgesRest: return (center && !cubieOfSide([UpSide.get(), DownSide.get()]))
                                            || (edge && otherFaceOfSide([UpSide.get()]))
            case Step.WhiteCorners: return corner && cubieOfSide([UpSide.get()])
            case Step.MiddleLayer: return edge && !cubieOfSide([UpSide.get(), DownSide.get()])
            case Step.YellowCross: return (center || edge) && faceOfSide([DownSide.get()])
            case Step.YellowCornerStickers: return corner && faceOfSide([DownSide.get()])
            case Step.YellowCornerRest: return corner && otherFaceOfSide([DownSide.get()])
            case Step.YellowEdgesRest: return edge && otherFaceOfSide([DownSide.get()])
            default: return false
        }
    }

    getHint(): Array<Displayable> {
        switch(this.activeStep) {
            case Step.WhiteCross: return [new Heading("White cross (1/8)"),
                                          new Text("Your task is to solve the white cross intuitively."),
                                          new Text("Create a white cross on any side of the cube."),
                                          new Text("The best way to do this is to locate the white center piece and try to move the 4 white edges to it one by one. The white center serves as a reference where the white cross will end up."),
                                          new Picture("/white_cross.png")]
            case Step.WhiteEdgesRest: return [new Heading("Swapping the Edges (2/8)"),
                                              new Text("We need the second color on the edge piece to match the center."),
                                              new Text("You can do this by rotating the edge to the side opposite of the white cross, then match the edge with the correct center piece and rotate it back."),
                                              new Text("Repeat this for all incorrectly placed edges."),
                                              new Text("If you need a little help with this, orient the cube so that the white cross if facing up and a incorrect pair is facing you. You can now do this to rotate the edge to the other side."),
                                              new Notation("F2"),
                                              new Text("Match the Edge with the correct center by doing this repeatedly."),
                                              new Notation("u"),
                                              new Text("Turn the edge back. This will likely rotate another edge to the other side."),
                                              new Notation("F2"),
                                              new Picture("/swap_edge.png")]
            case Step.WhiteCorners: return [new Heading("White Corner placement (3/8)"),
                                            new Text("Now make the white cross face the bottom side."),
                                            new Text("You can rotate the upper layer freely, rotate it until the corner you want in your bottom right position is above it (in the upper right position)."),
                                            new Text("To correctly place the corner to the bottom, we can use the \"sexy\" move. Do it until the corner is in the bottom position oriented correctly (you may need to do this up to 5 times)."),
                                            new Notation("R U R' U'"),
                                            new Text("Repeat this for all corners."),
                                            new Text("If there is a corner placed incorrectly, orient the cube so that the incorrect corner is in the bottom right and perform the \"sexy\" move once. This will move it to the upper layer."),
                                            new Picture("/white_corners.png")]
            case Step.MiddleLayer: return [new Heading("Middle Layer (4/8)"),
                                           new Text("In this step, you need to insert 4 edges between the center pieces."),
                                           new Text("Keep the white side facing down, rotate the upper layer until you match color of the edge piece with a center piece, orient the cube to face this side. By looking at the second color (on the top) of the edge, decide if you want the edge to go to the left or the right side."),
                                           new Text("Use the first notation to move it left and second to move it right."),
                                           new Notation("U' L' U L U F U' F'"),
                                           new Notation("U R U' R' U' F' U F"),
                                           new Text("Repeat this for all 4 edges, if an edge is placed incorrectly, imagine you have the correct edge prepared in the upper layer and perform the notation. This will push the incorrectly placed edge out of the slot to the upper layer, so it's available to place differently."),
                                           new Picture("/middle_layer.png")]
            case Step.YellowCross: return [new Heading("Yellow Cross (5/8)"),
                                           new Text("Now we need to solve the yellow cross on the upper side. This can be achieved just by applying the following notation. Always keep the white side facing down when applying the notation."),
                                           new Notation("F U R U' R' F'"),
                                           new Text("There are 3 possible cases:"),
                                           new Text("1. There is only the yellow center piece on the upper side - apply the notation with any side facing you (white side needs to face down) and pick the next case."),
                                           new Text("2. There is a straight yellow line on the upper side - apply the notation with any side facing you (white side needs to face down) and pick the next case."),
                                           new Text("3. There is a yellow \"L\" on the upper side - apply the notation with the two correct yellow edges being on the left and back of the upper side (white side needs to face down) - this should finish this step."),
                                            new Picture("/yellow_cross.png")]
            case Step.YellowCornerStickers: return [new Heading("Yellow Corner Orientation (6/8)"),
                                                    new Text("This step will orient the corners and thus solve the yellow side."),
                                                    new Text("You need to orient the cube with the white side facing down and any side facing you. Don't change the orientation through the whole step."),
                                                    new Text("The upper left corner is now your working space where you orient the corner, so the yellow side faces up. There are 3 possible cases:"),
                                                    new Text("1. The corner is oriented correctly - you don't need to do anything."),
                                                    new Text("2. The yellow side of the corner is facing you - do this."),
                                                    new Notation("L D' L' D L D' L' D"),
                                                    new Text("3. The yellow side of the corner is facing left - do this."),
                                                    new Notation("D' L D L' D' L D L'"),
                                                    new Text("Repeat this until all the yellow corners are oriented correctly. To continue to the next corner, move only the upper layer, do not rotate the whole cube."),
                                                    new Picture("/corner_orientation.png")]
            case Step.YellowCornerRest: return [new Heading("Yellow Corner position (7/8)"),
                                                new Text("In this step you need to swap some corner pieces on the upper layer."),
                                                new Text("To swap two corner pieces, orient the cube with the white side facing down and the two corner pieces you want to swap in the front, then apply the following notation."),
                                                new Notation("R' F R' B2 R F' R' B2 R2 U'"),
                                                new Text("Any rearrangement can be done by using this at most 2 times."),
                                                new Text("If you have trouble, try to find a side where the corner pieces color matches each other, the other two are the ones you need to swap. If no such side exists, swap any two of them and one side should appear."),
                                                new Text("you also need to match the swapped corners with the rest of the cube by rotating the upper layer."),
                                                new Notation("U"),
                                                new Picture("/yellow_corners.png")]
            case Step.YellowEdgesRest: return [new Heading("Yellow Edges position (8/8)"),
                                               new Text("In the last step you need to swap some edge pieces on the upper layer."),
                                               new Text("If all 4 edges are incorrectly placed - apply any of the following notations (with white side facing down) - this should solve one of them."),
                                               new Text("Orient the cube with the white side facing down and the solved side facing back. Now there are 2 possible cases:"),
                                               new Text("1. The wrongly placed edge piece in front of you belongs to the left side - apply the following notation."),
                                               new Notation("F2 U L R' F2 L' R U F2"),
                                               new Text("2. The wrongly placed edge piece in front of you belongs to the right side - apply the following notation."),
                                               new Notation("F2 U' L R' F2 L' R U' F2"),
                                               new Text("This should solve the cube."),
                                               new Picture("/yellow_edges.png")]
            default: return [new Heading("Solving tutorial with Hints"),
                             new Text("Hit the Scramble button to start solving with Hints!"),
                             new Heading("Notation"),
                             new Notation("R U R' U'"),
                             new Text("If you see this, you can rotate the cube directly with mouse or touch according to the [Rubik's cube notation](https://ruwix.com/the-rubiks-cube/notation), or just click on the notation and let the cube rotate for you."),
                             new Text("You can also enter notation in the text box above, be aware that moves applied by notation are always relative to the cube's orientation."),
                             new Heading("Funny Scrambles"),
                             new Text("Try applying these on a solved cube!"),
                             new Notation("R2 L2 U2 D2 F2 B2"),
                             new Notation("R L' U D' F' B R L'"),
                             new Heading("Credits"),
                             new Text("The app was created by [Jakub Smutný](https://jakubsmutny.cz) as bachelor thesis on [FIT CTU](https://fit.cvut.cz/en). Source code is available on [GitHub](https://github.com/jakubsmutny/rubiks-cube).")]
        }
    }
}
