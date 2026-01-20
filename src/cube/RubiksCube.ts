import * as THREE from 'three';

import { Cubie } from './Cubie';
import { PositionAtCube } from './PositionAtCube';
import { Face } from './Face';
import { SideIndex } from './SideIndex';
import { StickerProvider } from './StickerProvider';
import { Shuffle } from './Shuffle';
import { AnimationQueue } from './AnimationQueue';
import { Move } from './Move';

export class RubiksCube {

    update(): void {
        let secondsPassed = this.clock.getDelta();
        let frames = Math.floor(secondsPassed * 1000);
        for(let i = 0; i < frames; i++) {
            if(this.animationQueue.isEmpty()) return;
            let frame = this.animationQueue.popFrame();
            for(let cubie of this.cubies) {
                if(!cubie.position.inPlanes(frame.axis, frame.planes)) continue;
                cubie.move(frame.axis, frame.radians);
            }
            // TODO: Clear Shuffle when solved
            if(this.isSolved()) console.log("Solved");
        }
    }

}
