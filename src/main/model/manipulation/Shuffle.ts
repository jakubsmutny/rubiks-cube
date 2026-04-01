import { Move } from './Move';

export class Shuffle {

    moves: Array<Move>

    fast: boolean

    constructor(moves?: Array<Move>, fast: boolean = false) {
        if(moves) {this.moves = moves}
        else this.moves = new Array<Move>()
        this.fast = fast
    }

    getInverse(): Shuffle {
        let inverseMoves: Array<Move> = Array<Move>()
        for(let move of this.moves)
            inverseMoves.push(move.getInverse())
        return new Shuffle(inverseMoves.reverse(), this.fast)
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

    makeFast(): Shuffle {
        this.fast = true
        return this
    }

    getSpeed(): number {
        if(!this.fast) return 1
        let speed = Math.pow(this.size(), 2 / 3) / 4
        speed = Math.max(speed, 1)
        speed = Math.min(speed, 4)
        return speed
    }

    isEmpty(): boolean {
        return this.size() === 0
    }

    size(): number {
        return this.moves.length
    }
}
