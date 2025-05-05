import * as THREE from 'three';

import { Cubie } from './Cubie';
import { PositionAtCube } from './PositionAtCube';
import { Face } from './Face';
import { SideIndex } from './SideIndex';
import { StickerProvider } from './StickerProvider';
import { Shuffle } from './Shuffle';
import { AnimationQueue } from './AnimationQueue';
import { Move } from './Move';

export class RubicksCube {
    
    size: number;
    dimension: number;
    stickerProvider: StickerProvider;

    shuffle: Shuffle;
    animationQueue: AnimationQueue;
    clock: THREE.Clock;

    cubies: Array<Cubie>;

    constructor(size: number, dimension: number) {
        this.size = size;
        this.dimension = dimension;
        this.stickerProvider = new StickerProvider(dimension);

        this.shuffle = new Shuffle();
        this.animationQueue = new AnimationQueue();
        this.clock = new THREE.Clock();

        this.cubies = this.#createCubies();
    }

    #createCubies(): Array<Cubie> {
        let cubies = Array<Cubie>();
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                for (let k = 0; k < this.dimension; k++) {

                    if(this.#hollowSegment(i, j, k)) continue;

                    let position = new PositionAtCube(i, j, k, this.size, this.dimension);
                    let faces = this.#getFaces(i, j, k);

                    let cubie = new Cubie(position, faces, this.stickerProvider);
                    cubies.push(cubie);
                }
            }
        }
        return cubies;
    }

    #getFaces(i: number, j: number, k: number): Array<Face> {
        let cubieFaces = Array<Face>();
        if(i == 0) cubieFaces.push(new Face(SideIndex.LEFT, true));
        if(j == 0) cubieFaces.push(new Face(SideIndex.DOWN, true));
        if(k == 0) cubieFaces.push(new Face(SideIndex.BACK, true));
        if(i == this.dimension - 1) cubieFaces.push(new Face(SideIndex.RIGHT, true));
        if(j == this.dimension - 1) cubieFaces.push(new Face(SideIndex.UP, true));
        if(k == this.dimension - 1) cubieFaces.push(new Face(SideIndex.FRONT, true));
        return cubieFaces;
    }

    #hollowSegment(i: number, j: number, k: number): boolean {
        if(this.#neededInPlane(i, j)) return false;
        if(this.#neededInPlane(j, k)) return false;
        if(this.#neededInPlane(k, i)) return false;
        return true;
    }

    #neededInPlane(i: number, j: number): boolean {
        let center = new THREE.Vector2(this.size / 2, this.size / 2);
        let radius = this.size / 2; 
        let cubieSize = this.size / this.dimension;

        let point1 = new THREE.Vector2(i * cubieSize, j * cubieSize);
        let point2 = new THREE.Vector2((i + 1) * cubieSize, j * cubieSize);
        let point3 = new THREE.Vector2(i * cubieSize, (j + 1) * cubieSize);
        let point4 = new THREE.Vector2((i + 1) * cubieSize, (j + 1) * cubieSize);
        if(point1.distanceTo(center) > radius) return true;
        if(point2.distanceTo(center) > radius) return true;
        if(point3.distanceTo(center) > radius) return true;
        if(point4.distanceTo(center) > radius) return true;
        return false;
    }

    reset(): void {
        this.shuffle = new Shuffle();
        this.animationQueue = new AnimationQueue();
        for(let cubie of this.cubies) cubie.reset();
    }

    isSolved(): boolean {
        let normals = new Array<THREE.Vector3>(6);
        for (let cubie of this.cubies) for (let face of cubie.faces) {
            if(!face.visible) continue;
            if(!(face.sideId in normals)) {
                normals[face.sideId] = face.normal;
                continue;
            }
            if(face.normal.distanceTo(normals[face.sideId]) > 0.001)
                return false;
        }
        return true;
    }

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

    animationActive(): boolean {
        return !this.animationQueue.isEmpty();
    }

    manipulate(manipulation: Shuffle | Move): void {
        this.shuffle.append(manipulation);
        this.animationQueue.append(manipulation);
    }
}
