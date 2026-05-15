import {describe, it, expect, vi} from 'vitest'
import * as THREE from "three"
import { LayerRotation } from "../../../main/view/rotation/LayerRotation"
import { CubeModel } from "../../../main/model/CubeModel"
import { CubeView } from "../../../main/view/CubeView"
import { Axis } from "../../../main/model/utility/geometry/Axis"
import { SceneView } from "../../../main/view/SceneView"

function getLayerRotation(): LayerRotation {
    const sceneMock = {
        add: vi.fn(),
        remove: vi.fn(),
        attach: vi.fn()
    } as unknown as THREE.Scene
    const sceneViewMock = {
        cubeSize: 1,
        scene: sceneMock
    } as unknown as SceneView
    const model = new CubeModel(3)
    const cubeView: CubeView = new CubeView(model, sceneViewMock)
    const axis = Axis.X
    return new LayerRotation(cubeView, sceneMock, axis, [0])
}

describe('LayerRotation Class', () => {
    it('should return not finished when step fraction is set to non integer value', () => {
        const lr = getLayerRotation()
        lr.setStepFraction(0.5)
        expect(lr.isFinished()).toBe(false)
        lr.cleanup()
    })

    it('should return finished when step fraction is set to integer value', () => {
        const lr = getLayerRotation()
        lr.setStepFraction(2)
        expect(lr.isFinished()).toBe(true)
        lr.cleanup()
    })

    it('should not have groups set up before calling setStepFraction', () => {
        const lr = getLayerRotation()
        expect(lr.faceGroup).toBeUndefined()
        expect(lr.moveDividerGroup).toBeUndefined()
        expect(lr.staticDividerGroup).toBeUndefined()
        expect(lr.groupsSetUp).toBe(false)
        lr.cleanup()
    })

    it('should have groups set up after calling setStepFraction', () => {
        const lr = getLayerRotation()
        lr.setStepFraction(0)
        expect(lr.faceGroup).toBeDefined()
        expect(lr.moveDividerGroup).toBeDefined()
        expect(lr.staticDividerGroup).toBeDefined()
        expect(lr.groupsSetUp).toBe(true)
        lr.cleanup()
    })

    it('should correctly empty all groups on cleanup', () => {
        const lr = getLayerRotation()
        lr.setStepFraction(0)
        lr.cleanup()
        expect(lr.faceGroup?.children.length).toEqual(0)
        expect(lr.moveDividerGroup?.children.length).toEqual(0)
        expect(lr.staticDividerGroup?.children.length).toEqual(0)
        expect(lr.activeTurnStep).toEqual(0)
        expect(lr.groupsSetUp).toBe(false)
    })
})
