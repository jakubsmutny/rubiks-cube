import {Cubie} from "./Cubie";
import {CubieFactory} from "./factories/CubieFactory";

export class CubeModel {

    dimension: number;
    cubies: Array<Cubie>

    //shuffle: Shuffle;

    constructor(dimension: number) {
        this.dimension = dimension
        this.cubies = CubieFactory.createCubies(dimension)
    }

    isSolved(): boolean {
        return this.cubies.every(cubie => cubie.isSolved())
    }
}
