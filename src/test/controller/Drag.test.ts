import { describe, it, expect } from 'vitest'
import { Drag } from "../../main/controller/Drag"
import * as THREE from "three"
import { SceneView } from "../../main/view/SceneView"

describe('Drag Class', () => {
    it('should return positive turn size when turning near rail direction', () => {
        const sceneViewMock = {} as SceneView
        const start = new THREE.Vector2(0, 0)
        const cubieModelMock = {}
        const intersectionMock = {
            object: {
                userData: {
                    cubieModel: cubieModelMock
                }
            }
        } as unknown as THREE.Intersection
        const drag: Drag = new Drag(sceneViewMock, start, intersectionMock, 1)
        drag.rail = new THREE.Vector2(1, 0)
        drag.updatePosition(new THREE.Vector2(1, 1))
        expect(drag.getTurnSize()).toBeGreaterThan(0)
    })

    it('should return negative turn size when turning near opposite of rail direction', () => {
        const sceneViewMock = {} as SceneView
        const start = new THREE.Vector2(0, 0)
        const cubieModelMock = {}
        const intersectionMock = {
            object: {
                userData: {
                    cubieModel: cubieModelMock
                }
            }
        } as unknown as THREE.Intersection
        const drag: Drag = new Drag(sceneViewMock, start, intersectionMock, 1)
        drag.rail = new THREE.Vector2(1, 0)
        drag.updatePosition(new THREE.Vector2(-1, -1))
        expect(drag.getTurnSize()).toBeLessThan(0)
    })

    it('should return zero turn size when turning orthogonal to rail direction', () => {
        const sceneViewMock = {} as SceneView
        const start = new THREE.Vector2(0, 0)
        const cubieModelMock = {}
        const intersectionMock = {
            object: {
                userData: {
                    cubieModel: cubieModelMock
                }
            }
        } as unknown as THREE.Intersection
        const drag: Drag = new Drag(sceneViewMock, start, intersectionMock, 1)
        drag.rail = new THREE.Vector2(1, 0)
        drag.updatePosition(new THREE.Vector2(0, -1))
        expect(drag.getTurnSize()).toEqual(0)
    })
})
