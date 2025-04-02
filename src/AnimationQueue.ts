import { Move } from './Move';
import { Shuffle } from './Shuffle';

export class AnimationQueue {

    queue: Array<Move>;
    framesPerTurn: number;

    constructor(framesPerTurn?: number) {
        this.queue = new Array<Move>();

        if(framesPerTurn !== undefined) this.framesPerTurn = framesPerTurn;
        else this.framesPerTurn = 1000;
    }

    append(toAppend: Shuffle | Move): void {
        if(toAppend instanceof Move)
            this.#appendMove(toAppend);
        if(toAppend instanceof Shuffle)
            for (let move of toAppend.moves)
                this.#appendMove(move);
    }

    #appendMove(move: Move): void {
        let turns = Math.abs(move.radians) / (Math.PI / 2);
        let frames = this.framesPerTurn * turns;
        let frame = move.clone();
        frame.radians /= frames;
        for (let i = 0; i < frames; i++)
            this.queue.push(frame);
    }

    popFrame(): Move {
        if(this.isEmpty()) return Move.empty();
        return this.queue.shift()!;
    }

    isEmpty() {
        return this.queue.length == 0;
    }
}
