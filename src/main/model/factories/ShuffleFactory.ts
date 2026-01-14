import {Move} from "../manipulation/Move";
import {Shuffle} from "../manipulation/Shuffle";
import {MoveFactory} from "./MoveFactory";

export class ShuffleFactory {

    dimension: number
    moveFactory: MoveFactory

    constructor(dimension: number) {
        this.dimension = dimension
        this.moveFactory = new MoveFactory(dimension)
    }

    createFromNotation(notation: string): Shuffle {
        let moves = Array<Move>()
        let moveStrings = notation.split(/\s+/)
        for(let moveString of moveStrings) {
            if(!this.moveFactory.isNotationValid(moveString)) continue
            moves.push(this.moveFactory.createFromNotation(moveString))
        }
        return new Shuffle(moves)
    }

    createRandom(moveCount: number): Shuffle {
        const moves: Array<Move> = Array.from(
            { length: moveCount },
            () => this.moveFactory.createRandom()
        )
        return new Shuffle(moves)
    }

    static createEmpty(): Shuffle {
        return new Shuffle(new Array<Move>())
    }
}
