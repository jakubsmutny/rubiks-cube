import {Face} from "../Face"
import {Cubie} from "../Cubie"
import {Side} from "../utility/side/Side"
import {UpSide} from "../utility/side/UpSide"
import {DownSide} from "../utility/side/DownSide"
import {Vector} from "../geometry/Vector"
import {CubeModel} from "../CubeModel"

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
        this.activeStep = 0
        this.totalSteps = Object.keys(Step).filter(k => isNaN(Number(k))).length
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
        this.cubeModel.notifyVisibility()
    }

    update(): void {
        while(this.stepFinished() && !this.finished()) {
            if(!this.finished()) this.activeStep++
            this.groups[this.activeStep].forEach(face => face.visible = true)
            this.cubeModel.notifyVisibility()
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
}
