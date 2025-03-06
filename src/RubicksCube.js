import * as THREE from 'three';

import { Cubie } from './cubie.js';

export class RubicksCube {
    
    size;
    dimension;
    cubies;

    constructor(size, dimension) {
        this.size = size;
        this.dimension = dimension;
        this.cubies = [];

        this.#createCubies();
    }

    #createCubies() {
        let cubieSize = this.size / this.dimension;
        let offset = (this.size - this.size / this.dimension) / 2;

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                for (let k = 0; k < this.dimension; k++) {

                    // make the cube hollow
                    if (i != 0 && i != this.dimension - 1
                        && j != 0 && j != this.dimension - 1
                        && k != 0 && k != this.dimension - 1) {
                        continue;
                    }

                    let positionX = i * cubieSize - offset;
                    let positionY = j * cubieSize - offset;
                    let positionZ = k * cubieSize - offset;

                    let cubie = new Cubie(cubieSize * 0.95, positionX, positionY, positionZ);
                    this.cubies.push(cubie);
                }
            }
        }
    }

}
