import {Cubie} from "./Cubie"
import {CubieFactory} from "./factories/CubieFactory"
import {Shuffle} from "./manipulation/Shuffle"
import {ShuffleFactory} from "./factories/ShuffleFactory"
import {Vector} from "./geometry/Vector"
import {Observable} from "./utility/observer/Observeble"
import {Observer} from "./utility/observer/Observer"
import {Move} from "./manipulation/Move"
import {Beginners3x3Method} from "./solve/Beginners3x3Method"
import {SolveMethod} from "./solve/SolveMethod"
import {EmptyMethod} from "./solve/EmptyMethod"

export class CubeModel implements Observable {

    dimension: number
    cubies: Array<Cubie>
    shuffle: Shuffle

    manipulations: Array<Shuffle>
    currentManipulation: number

    observers: Array<Observer>

    method: SolveMethod

    constructor(dimension: number) {
        this.dimension = dimension
        this.cubies = CubieFactory.createCubies(dimension)
        this.shuffle = ShuffleFactory.createEmpty()
        this.manipulations = new Array<Shuffle>()
        this.currentManipulation = 0
        this.observers = new Array<Observer>()
        this.method = dimension === 3 ? new Beginners3x3Method(this) : new EmptyMethod(this)
    }

    isSolved(): boolean {
        let normals = new Array<Vector>(6)
        for(let cubie of this.cubies) for(let face of cubie.faces) {
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
        this.manipulate(this.shuffle.getInverse().makeFast())
    }

    scramble(): void {
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(this.dimension)
        this.manipulate(shuffleFactory.scramble().makeFast())
        this.method.start()
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
    }

    private execute(manipulation: Shuffle): void {
        for(let move of manipulation.moves) {
            this.cubies.forEach(cubie => cubie.manipulate(move))
            this.notifyMove(move, manipulation.getSpeed())
        }
        this.shuffle.append(manipulation)
        if(this.isSolved()) this.shuffle = ShuffleFactory.createEmpty()
        this.method.update()
    }

    register(observer: Observer) {
        this.observers.push(observer)
    }

    notifyMove(move: Move, speed: number) {
        this.observers.forEach(observer => observer.updateMove(move, speed))
    }

    notifyMethodStep() {
        this.observers.forEach(observer => observer.updateMethodStep())
    }
}
