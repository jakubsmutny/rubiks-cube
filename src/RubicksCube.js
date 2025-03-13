import * as THREE from 'three';

import { Cubie } from './cubie.js';
import { PositionAtCube } from './PositionAtCube.js';
import { Face } from './Face.js';
import { ColorIndex } from './ColorIndex.js';

export class RubicksCube {
    
    size;
    dimension;
    cubies = [];

    constructor(size, dimension) {
        this.size = size;
        this.dimension = dimension;

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
        let faces = [];
        if(i == 0) faces.push(new Face(ColorIndex.ORANGE, true));
        if(j == 0) faces.push(new Face(ColorIndex.YELLOW, true));
        if(k == 0) faces.push(new Face(ColorIndex.BLUE, true));
        if(i == this.dimension - 1) faces.push(new Face(ColorIndex.RED, true));
        if(j == this.dimension - 1) faces.push(new Face(ColorIndex.WHITE, true));
        if(k == this.dimension - 1) faces.push(new Face(ColorIndex.GREEN, true));        
        return faces;
    }

    rotate(axis, plane, radians) {
        for(let cubie of this.cubies) {
            if(!cubie.position.inPlane(axis, plane)) continue;
            cubie.position.move(axis, radians);
            cubie.updateFromPosition();
        }
    }

}
