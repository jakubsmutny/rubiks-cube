import {CubeModel} from "../model/CubeModel";

export class CubeView {

    cubeModel: CubeModel

    constructor(cubeModel: CubeModel) {
        this.cubeModel = cubeModel
    }

    update(): void {

    }
}

// TODO
/*        this.rubiksCube = new RubiksCube(cubeSize, dimension);
        for(let cubie of this.rubiksCube.cubies)
            this.scene.add(cubie.graphics);
*/