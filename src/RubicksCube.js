import { Cubie } from './cubie.js';
import { PositionAtCube } from './PositionAtCube.js';
import { Face } from './Face.js';
import { SideIndex } from './SideIndex.js';
import { StickerProvider } from './StickerProvider.js';

export class RubicksCube {
    
    size;
    dimension;
    stickerProvider;

    cubies = [];
    faces = [];

    constructor(size, dimension) {
        this.size = size;
        this.dimension = dimension;
        this.stickerProvider = new StickerProvider(dimension);

        this.#createCubies();
    }

    #createCubies() {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                for (let k = 0; k < this.dimension; k++) {

                    // Make the cube hollow
                    if (i != 0 && i != this.dimension - 1
                        && j != 0 && j != this.dimension - 1
                        && k != 0 && k != this.dimension - 1) {
                        continue;
                    }

                    let position = new PositionAtCube(i, j, k, this.size, this.dimension);
                    let faces = this.#getFaces(i, j, k);

                    let cubie = new Cubie(position, faces);
                    this.cubies.push(cubie);
                }
            }
        }
    }

    #getFaces(i, j, k) {
        let cubieFaces = [];
        if(i == 0) cubieFaces.push(new Face(SideIndex.LEFT, this.stickerProvider, true));
        if(j == 0) cubieFaces.push(new Face(SideIndex.DOWN, this.stickerProvider, true));
        if(k == 0) cubieFaces.push(new Face(SideIndex.BACK, this.stickerProvider, true));
        if(i == this.dimension - 1) cubieFaces.push(new Face(SideIndex.RIGHT, this.stickerProvider, true));
        if(j == this.dimension - 1) cubieFaces.push(new Face(SideIndex.UP, this.stickerProvider, true));
        if(k == this.dimension - 1) cubieFaces.push(new Face(SideIndex.FRONT, this.stickerProvider, true));
        this.faces.push(...cubieFaces);
        return cubieFaces;
    }

    rotate(axis, plane, radians) {
        for(let cubie of this.cubies) {
            if(!cubie.position.inPlane(axis, plane)) continue;
            cubie.move(axis, radians);
        }
        if(this.isSolved()) console.log("Solved");
    }

    isSolved() {
        let normals = new Array(6);
        for (let face of this.faces) {
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

}
