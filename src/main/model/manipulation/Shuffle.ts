import { Move } from './Move';

export class Shuffle {

    moves: Array<Move>

    constructor(moves: Array<Move>) {
        this.moves = new Array<Move>()
        for(let move of moves) {
            this.appendMove(move)
        }
    }

    getInverse(): Shuffle {
        let inverseMoves: Array<Move> = Array<Move>()
        for (let move of this.moves)
            inverseMoves.push(move.getInverse())
        return new Shuffle(inverseMoves.reverse())
    }

    append(appendable: Shuffle | Move): void {
        if(appendable instanceof Move) {
            this.appendMove(appendable.clone())
        }
        if(appendable instanceof Shuffle) {
            for (let move of appendable.moves) {
                this.appendMove(move.clone())
            }
        }
    }

    private appendMove(move: Move): void {
        if(!this.isEmpty()) {
            let lastMove: Move = this.moves[this.moves.length - 1]
            if(lastMove.isConcatenableWith(move)) {
                this.moves.pop()
                move = lastMove.concatenate(move)
            }
        }
        if(!move.isEmpty()) {
            this.moves.push(move)
        }
    }

    isEmpty(): boolean {
        return this.moves.length === 0
    }
}
