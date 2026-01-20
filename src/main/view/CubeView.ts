import * as THREE from 'three'
import {CubeModel} from "../model/CubeModel"
import {CubieView} from "./CubieView"
import {StickerProvider} from "./StickerProvider"
import {Observer} from "../model/utility/observer/Observer";

export class CubeView implements Observer {

    cubeModel: CubeModel

    stickerProvider: StickerProvider

    cubieViews: Array<CubieView>
    group: THREE.Group

    constructor(cubeModel: CubeModel) {
        this.cubeModel = cubeModel
        this.stickerProvider = new StickerProvider(cubeModel.dimension)
        this.cubieViews = new Array<CubieView>()
        cubeModel.cubies.forEach(cubie => {this.cubieViews.push(new CubieView(cubie, cubeModel.dimension, this.stickerProvider))})
        this.group = new THREE.Group()
        this.cubieViews.forEach(cubieView => this.group.add(cubieView.mesh))
        cubeModel.register(this)
    }

    update(): void {
        // TODO Animation logic
    }

    updateFromObservable(): void {
        this.cubieViews.forEach(cubieView => cubieView.updateFromModel())
    }
}
