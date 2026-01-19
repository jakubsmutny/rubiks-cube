import * as THREE from 'three';

import {CubeModel} from "../model/CubeModel";
import {CubieView} from "./CubieView";

export class CubeView {

    cubeModel: CubeModel

    cubieViews: Array<CubieView>
    group: THREE.Group

    constructor(cubeModel: CubeModel) {
        this.cubeModel = cubeModel
        this.cubieViews = new Array<CubieView>()
        cubeModel.cubies.forEach(cubie => {this.cubieViews.push(new CubieView(cubie, cubeModel.dimension))})
        this.group = new THREE.Group()
        this.cubieViews.forEach(cubieView => this.group.add(cubieView.mesh))
    }

    update(): void {
        // TODO Animation logic
        this.updateFromModel()
    }

    updateFromModel(): void {
        this.cubieViews.forEach(cubieView => cubieView.updateFromModel())
    }
}
