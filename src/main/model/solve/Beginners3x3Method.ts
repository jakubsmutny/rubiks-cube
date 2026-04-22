import {Face} from "../Face"
import {Cubie} from "../Cubie"
import {Side} from "../utility/side/Side"
import {UpSide} from "../utility/side/UpSide"
import {DownSide} from "../utility/side/DownSide"
import {Vector} from "../geometry/Vector"
import {CubeModel} from "../CubeModel"
import {SolveMethod} from "./SolveMethod"
import {Displayable} from "../display/Displayable"
import {DisplayableHeading} from "../display/DisplayableHeading"
import {DisplayableText} from "../display/DisplayableText"
import {DisplayableNotation} from "../display/DisplayableNotation"

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
            case Step.WhiteCross: return [new DisplayableHeading("White cross (1/8)"),
                                          new DisplayableText("Your task is to solve the white cross intuitively."),
                                          new DisplayableText("Create a white cross on any side of the cube.")]
            case Step.WhiteEdgesRest: return [new DisplayableHeading("Swapping the Edges (2/8)"),
                                              new DisplayableText("We need the second colour on the Edge piece to match the Center."),
                                              new DisplayableText("You can do this by rotating the Edge to the side opposite of the White cross, then match the Edge with the correct Center piece and rotate it back."),
                                              new DisplayableText("Repeat this for all incorrectly placed Edges."),
                                              new DisplayableText("If you need a little help with this, orient the cube so that the White cross if facing down and a incorrect pair is facing you. You can now do this to rotate the Edge to the other side."),
                                              new DisplayableNotation("F2"),
                                              new DisplayableText("Match the Edge with the correct Center by doing this repeatedly."),
                                              new DisplayableNotation("Dw"),
                                              new DisplayableText("Turn the Edge back. This will likely rotate another Edge to the other side."),
                                              new DisplayableNotation("F2"),
                                              new DisplayableText("Repeat this until all Edges are correctly placed.")]
            case Step.WhiteCorners: return [new DisplayableHeading("White Corner placement (3/8)"),
                                            new DisplayableText("Now make the white cross face the bottom side."),
                                            new DisplayableText("You can rotate the upper layer freely, rotate it until the corner you want in your bottom right position is above it (in the upper right position)."),
                                            new DisplayableText("To correctly place the corner to the bottom, we can use the \"sexy\" move. Do it until the corner is in the bottom position oriented correctly (you may need to do this up to 5 times)."),
                                            new DisplayableNotation("R U R' U'"),
                                            new DisplayableText("Repeat this for all corners."),
                                            new DisplayableText("If there is a corner placed incorrectly, orient the cube so that the incorrect corner is in the bottom right and perform the \"sexy\" move once. This will move it to the upper layer.")]
            case Step.MiddleLayer: return [new DisplayableHeading("Middle Layer (4/8)"),
                                           new DisplayableText("In this step, you need to insert 4 edges between the center pieces."),
                                           new DisplayableText("Keep the White side facing down, rotate the upper layer until you match color of the Edge piece with a Center piece, orient the cube to face this side. By looking at the second colour (on the top) of the Edge, decide if you want the Edge to go to the left or the right side."),
                                           new DisplayableText("Use the first notation to move it left and second to move it right."),
                                           new DisplayableNotation("U' L' U L U F U' F'"),
                                           new DisplayableNotation("U R U' R' U' F' U F"),
                                           new DisplayableText("Repeat this for all 4 edges, if an Edge is placed incorrectly, imagine you have the correct Edge prepared and perform the notation. This will push the incorrectly placed edge to the upper layer, so it's available to place differently.")]
            case Step.YellowCross: return [new DisplayableHeading("Yellow Cross (5/8)"),
                                           new DisplayableText("Now we need to solve the yellow cross on the upper side. This can be achieved just by applying the following notation. Always keep the white side facing down when applying the notation."),
                                           new DisplayableNotation("F U R U' R' F'"),
                                           new DisplayableText("There are 3 possible cases:"),
                                           new DisplayableText("1. There is only the yellow center piece on the upper side - apply the notation with any side facing you (white side needs to face down) and pick the next case."),
                                           new DisplayableText("2. There is a straight yellow line on the upper side - apply the notation with any side facing you (white side needs to face down) and pick the next case."),
                                           new DisplayableText("3. There is a yellow \"L\" on the upper side - apply the notation with the two correct yellow edges being on the left and back of the upper side (white side needs to face down) - this should finish this step.")]
            case Step.YellowCornerStickers: return [new DisplayableHeading("Yellow Corner Orientation (6/8)"),
                                                    new DisplayableText("This step will orient the corners and thus solve the whole yellow side."),
                                                    new DisplayableText("You need to orient the cube with the white side facing down and any side facing you, but you can't change the side facing you through the whole step."),
                                                    new DisplayableText("The upper left corner is now your working space, where you orient the corner, so the yellow side faces up. There are 3 possible cases:"), new DisplayableText("1. The corner is oriented correctly - you don't need to do anything."),
                                                    new DisplayableText("2. The yellow side of the corner is facing you - perform the following notation."),
                                                    new DisplayableNotation("L D' L' D L D' L' D"),
                                                    new DisplayableText("3. The yellow side of the corner is facing left - perform the following notation."),
                                                    new DisplayableNotation("D' L D L' D' L D L'"),
                                                    new DisplayableText("To continue to the next corner, move the upper layer, do not rotate the whole cube."),
                                                    new DisplayableNotation("U"),
                                                    new DisplayableText("Repeat this until all the yellow corners are oriented correctly.")]
            case Step.YellowCornerRest: return [new DisplayableHeading("Yellow Corner position (7/8)"),
                                                new DisplayableText("In this step you need to swap some corner pieces on the upper layer."),
                                                new DisplayableText("To swap two corner pieces, orient the cube with the white side facing down and the two corner pieces you want to swap in the front, then apply the following notation."),
                                                new DisplayableNotation("R' F R' B2 R F' R' B2 R2 U'"),
                                                new DisplayableText("Any rearrangement can be done by using this at most 2 times."),
                                                new DisplayableText("If you have trouble, try to find a side where the corner pieces colour matches each other, the other two are the ones you need to swap. If no such side exists, swap any two of them and one side should appear.")]
            case Step.YellowEdgesRest: return [new DisplayableHeading("Yellow Edges position (8/8)"),
                                               new DisplayableText("In the last step you need to swap some edge pieces on the upper layer."),
                                               new DisplayableText("If all 4 edges are incorrectly placed - apply any of the following notations (with white side facing down) - this should solve one of them."),
                                               new DisplayableText("Orient the cube with the white side facing down and the solved side facing back. Now there are 2 possible cases:"),
                                               new DisplayableText("1. The wrongly placed edge piece in front of you belongs to the left side - apply the following notation."),
                                               new DisplayableNotation("F2 U L R' F2 L' R U F2"),
                                               new DisplayableText("2. The wrongly placed edge piece in front of you belongs to the right side - apply the following notation."),
                                               new DisplayableNotation("F2 U' L R' F2 L' R U' F2"),
                                               new DisplayableText("This should solve the cube.")]
            default: return [new DisplayableHeading("Solving tutorial with Hints"),
                             new DisplayableText("Hit the Scramble button to start solving with Hints!"),
                             new DisplayableHeading("Notation"),
                             new DisplayableNotation("R U R' U'"),
                             new DisplayableText("If you see this, you can rotate the cube directly with mouse or touch according to the official Rubik's cube notation, or just click on the notation and let the cube rotate for you."),
                             new DisplayableText("You can also enter notation in the text box above, be aware that moves applied by notation are always relative to the cube's orientation."),
                             new DisplayableHeading("Funny Scrambles"),
                             new DisplayableText("Try applying these on a solved cube!"),
                             new DisplayableNotation("R2 L2 U2 D2 F2 B2"),
                             new DisplayableNotation("R L' U D' F' B R L'"),
                             new DisplayableHeading("Credits"),
                             new DisplayableText("The app was created by Jakub Smutný as a bachelor thesis on FIT CTU. Source code is available on GitHub.")]
        }
    }
}
