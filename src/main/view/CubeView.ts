import * as THREE from 'three'
import * as TWEEN from "@tweenjs/tween.js"
import {CubeModel} from "../model/CubeModel"
import {CubieView} from "./CubieView"
import {StickerProvider} from "./utility/StickerProvider"
import {Observer} from "../model/utility/observer/Observer"
import {Move} from "../model/manipulation/Move"
import {Animation} from "./Animation"
import {SceneView} from "./SceneView";
import {GeometryProvider} from "./utility/GeometryProvider";

export class CubeView implements Observer {

    cubeModel: CubeModel
    sceneView: SceneView
    animationQueue: Array<Animation>
    tweenGroup: TWEEN.Group

    stickerProvider: StickerProvider
    geometryProvider: GeometryProvider

    cubieViews: Array<CubieView>
    group: THREE.Group

    activeTurnSize: number

    constructor(cubeModel: CubeModel, sceneView: SceneView) {
        this.cubeModel = cubeModel
        this.sceneView = sceneView
        this.animationQueue = new Array<Animation>()
        this.tweenGroup = new TWEEN.Group()
        this.stickerProvider = new StickerProvider(cubeModel.dimension)
        this.geometryProvider = new GeometryProvider(SceneView.cubeSize / cubeModel.dimension)
        this.cubieViews = new Array<CubieView>()
        cubeModel.cubies.forEach(cubie => {
            this.cubieViews.push(new CubieView(cubie, cubeModel.dimension, this.stickerProvider, this.geometryProvider))
        })
        this.group = new THREE.Group()
        this.cubieViews.forEach(cubieView => this.group.add(cubieView.meshGroup))
        cubeModel.register(this)
        this.activeTurnSize = 0
    }

    update(): void {
        this.tweenGroup.update()
        if(this.animationQueue.length > 0) {
            const currentAnimation = this.animationQueue[0];
            if(!currentAnimation.started) {
                currentAnimation.start(this.tweenGroup)
            }
            if(currentAnimation.finished) {
                this.animationQueue.shift()
                if(this.animationQueue.length === 0) {
                    this.cubieViews.forEach(cv => cv.updatePositionFromModel());
                }
            }
        }
    }

    updateFromObservable(move: Move): void {
        this.animationQueue.push(new Animation(this, this.sceneView.scene, move))
    }

    isAnimating(): boolean {
        return this.animationQueue.length > 0
    }
}
