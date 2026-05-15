import { describe, it, expect, vi } from 'vitest'
import { CubeView } from "../../main/view/CubeView"
import { SceneView } from "../../main/view/SceneView"
import { CubeModel } from "../../main/model/CubeModel"
import { ShuffleFactory } from "../../main/model/utility/factories/ShuffleFactory"

describe('CubeView Class', () => {
    it('should animate when manipulation has been set', () => {
        const sceneViewMock = {
            cubeSize: 1,
            scene: {
                add: vi.fn(),
                remove: vi.fn()
            }
        } as unknown as SceneView
        const model = new CubeModel(3)
        const sf = new ShuffleFactory(3)
        const cubeView: CubeView = new CubeView(model, sceneViewMock)
        model.manipulate(sf.createFromNotation("R"))
        expect(cubeView.isAnimating()).toBe(true)
        cubeView.dispose()
    })

    it('should not animate when empty manipulation has been set', () => {
        const sceneViewMock = {
            cubeSize: 1,
            scene: {
                add: vi.fn(),
                remove: vi.fn()
            }
        } as unknown as SceneView
        const model = new CubeModel(3)
        const sf = new ShuffleFactory(3)
        const cubeView: CubeView = new CubeView(model, sceneViewMock)
        model.manipulate(sf.createFromNotation(""))
        expect(cubeView.isAnimating()).toBe(false)
        cubeView.dispose()
    })
})
