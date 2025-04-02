import { Move } from './Move';

export class Shuffle {

    moves: Array<Move>;

    constructor(moves?: Array<Move>) {
        if(moves !== undefined) this.moves = moves;
        else this.moves = new Array<Move>();
    }
    static fromNotation(notation: string, dimension: number): Shuffle {
        let moves = Array<Move>();
        let moveStrings = notation.split(/\s+/);
        for (let moveString of moveStrings) {
            if(!Move.notationValid(moveString, dimension)) continue;
            moves.push(Move.fromNotation(moveString, dimension));
        }
        return new Shuffle(moves);
    }
    static random(moveCount: number, dimension: number): Shuffle {
        let moves = new Array<Move>();
        for (let i = 0; i < moveCount; i++)
            moves.push(Move.random(dimension));
        return new Shuffle(moves);
    }

    getInverse(): Shuffle {
        let inverseMoves = Array<Move>();
        for (let move of this.moves)
            inverseMoves.push(move.getInverse());
        return new Shuffle(inverseMoves.reverse());
    }

    append(toAppend: Shuffle | Move): void {
        if(toAppend instanceof Move)
            this.#appendMove(toAppend.clone());
        if(toAppend instanceof Shuffle)
            for (let move of toAppend.moves)
                this.#appendMove(move.clone());
    }

    #appendMove(move: Move): void {
        if(this.moves.length) {
            let lastMove = this.moves[this.moves.length - 1];
            if(move.sameAxisPlanes(lastMove)) {
                move.addRadiansFrom(lastMove);
                this.moves.pop();
            }
        }
        if(!move.isEmpty())
            this.moves.push(move);
    }
}
