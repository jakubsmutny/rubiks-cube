import {Cubie} from "./Cubie";
import {CubieFactory} from "./factories/CubieFactory";
import {Shuffle} from "./manipulation/Shuffle";
import {ShuffleFactory} from "./factories/ShuffleFactory";
import {Vector} from "./geometry/Vector";
import {Observable} from "./utility/observer/Observeble";
import {Observer} from "./utility/observer/Observer";
import {Move} from "./manipulation/Move";

export class CubeModel implements Observable {

    dimension: number
    cubies: Array<Cubie>
    shuffle: Shuffle

    manipulations: Array<Shuffle>
    currentManipulation: number

    observers: Array<Observer>

    constructor(dimension: number) {
        this.dimension = dimension
        this.cubies = CubieFactory.createCubies(dimension)
        this.shuffle = ShuffleFactory.createEmpty()
        this.manipulations = new Array<Shuffle>()
        this.currentManipulation = 0
        this.observers = new Array<Observer>()
    }

    isSolved(): boolean {
        let allVisible: boolean = true
        for(let cubie of this.cubies) for(let face of cubie.faces)
            if(!face.visible) allVisible = false
        return this.stepSolved() && allVisible
    }

    stepSolved(): boolean {
        let normals = new Array<Vector>(6)
        for(let cubie of this.cubies) for(let face of cubie.faces) {
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

    solve(): void {
        this.manipulate(this.shuffle.getInverse())
    }

    undo(): void {
        if(this.currentManipulation > 0) {
            this.execute(this.manipulations[this.currentManipulation - 1].getInverse())
            this.currentManipulation--
        }
    }

    redo(): void {
        if(this.manipulations.length > this.currentManipulation) {
            this.execute(this.manipulations[this.currentManipulation])
            this.currentManipulation++
        }
    }

    manipulate(manipulation: Shuffle): void {
        while(this.manipulations.length > this.currentManipulation) {
            this.manipulations.pop()
        }
        this.execute(manipulation)
        this.manipulations.push(manipulation)
        this.currentManipulation++
        if(this.isSolved()) {
            this.shuffle = ShuffleFactory.createEmpty()
            this.manipulations = new Array<Shuffle>()
            this.currentManipulation = 0
        }
    }

    private execute(manipulation: Shuffle): void {
        for(let move of manipulation.moves) {
            this.cubies.forEach(cubie => cubie.manipulate(move))
            this.notify(move)
        }
        this.shuffle.append(manipulation)
    }

    register(observer: Observer) {
        this.observers.push(observer)
    }

    notify(move: Move) {
        this.observers.forEach(observer => observer.updateFromObservable(move))
    }
}
