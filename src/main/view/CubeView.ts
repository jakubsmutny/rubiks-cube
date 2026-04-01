import * as THREE from 'three'
import * as TWEEN from "@tweenjs/tween.js"
import {CubeModel} from "../model/CubeModel"
import {CubieView} from "./CubieView"
import {MaterialProvider} from "./utility/MaterialProvider"
import {Observer} from "../model/utility/observer/Observer"
import {Move} from "../model/manipulation/Move"
import {Animation} from "./rotation/Animation"
import {SceneView} from "./SceneView";
import {GeometryProvider} from "./utility/GeometryProvider";
import {LayerRotation} from "./rotation/LayerRotation";

export class CubeView implements Observer {

    cubeModel: CubeModel
    sceneView: SceneView
    animationQueue: Array<Animation>
    tweenGroup: TWEEN.Group

    materialProvider: MaterialProvider
    geometryProvider: GeometryProvider

    cubieViews: Array<CubieView>
    group: THREE.Group

    activeLayerRotation: LayerRotation | undefined

    constructor(cubeModel: CubeModel, sceneView: SceneView) {
        this.cubeModel = cubeModel
        this.sceneView = sceneView
        this.animationQueue = new Array<Animation>()
        this.tweenGroup = new TWEEN.Group()

        this.materialProvider = new MaterialProvider(cubeModel.dimension)
        this.geometryProvider = new GeometryProvider(SceneView.cubeSize, cubeModel.dimension)
        this.cubieViews = new Array<CubieView>()
        cubeModel.cubies.forEach(cubie => {
            this.cubieViews.push(new CubieView(cubie, cubeModel.dimension, this.materialProvider, this.geometryProvider))
        })
        this.group = new THREE.Group()
        this.cubieViews.forEach(cubieView => this.group.add(cubieView.meshGroup))
        sceneView.scene.add(this.group)
        cubeModel.register(this)
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

    updateFromObservable(move: Move, speed: number): void {
        if(!this.activeLayerRotation) this.activeLayerRotation = new LayerRotation(this, this.sceneView.scene, move.axis, move.planes)
        this.animationQueue.push(new Animation(this.activeLayerRotation, move.steps - this.activeLayerRotation.activeTurnStep, speed))
        this.activeLayerRotation = undefined
    }

    isAnimating(): boolean {
        return this.animationQueue.length > 0
    }

    dispose(): void {
        this.tweenGroup.removeAll();
        this.sceneView.scene.remove(this.group)
        this.materialProvider.dispose()
        this.geometryProvider.dispose()
    }
}
