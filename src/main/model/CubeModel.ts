import {Cubie} from "./Cubie";
import {CubieFactory} from "./factories/CubieFactory";
import {Shuffle} from "./manipulation/Shuffle";
import {ShuffleFactory} from "./factories/ShuffleFactory";
import {Move} from "./manipulation/Move";
import {Vector} from "./geometry/Vector";

export class CubeModel {

    dimension: number;
    cubies: Array<Cubie>
    shuffle: Shuffle;

    constructor(dimension: number) {
        this.dimension = dimension
        this.cubies = CubieFactory.createCubies(dimension)
        this.shuffle = ShuffleFactory.createEmpty()
    }

    isSolved(): boolean {
        let allVisible: boolean = true
        for(let cubie of this.cubies) for(let face of cubie.faces)
            if(!face.visible) allVisible = false
        return allVisible && this.stepSolved()
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

    manipulate(manipulation: Shuffle | Move): void {
        if(manipulation instanceof Move) {
            this.cubies.forEach(cubie => cubie.manipulate(manipulation))
        }
        if(manipulation instanceof Shuffle) {
            for (let move of manipulation.moves) {
                this.cubies.forEach(cubie => cubie.manipulate(move))
            }
        }
        this.shuffle.append(manipulation)
        if(this.isSolved()) {
            this.shuffle = ShuffleFactory.createEmpty()
        }
    }
}
