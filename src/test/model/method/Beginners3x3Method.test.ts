import { describe, it, expect, vi } from 'vitest'
import { Beginners3x3Method } from '../../../main/model/method/Beginners3x3Method'
import { CubeModel } from "../../../main/model/CubeModel"
import { Cubie } from "../../../main/model/Cubie"

describe('Beginners3x3Method Class', () => {
    it('should be finished after starting if has no cubies', () => {
        const mockModel = {
            cubies: Array<Cubie>(),
            notifyMethodStep: vi.fn()
        } as unknown as CubeModel
        const method = new Beginners3x3Method(mockModel)
        method.start()
        expect(method.finished()).toBe(true)
    })

    it('should return the correct number of total steps', () => {
        const mockModel = {
            cubies: Array<Cubie>(),
            notifyMethodStep: vi.fn()
        } as unknown as CubeModel
        const method = new Beginners3x3Method(mockModel)
        expect(method.totalSteps).toEqual(8)
    })

    it('should have empty face groups when provided with no cubies', () => {
        const mockModel = {
            cubies: Array<Cubie>(),
            notifyMethodStep: vi.fn()
        } as unknown as CubeModel
        const method = new Beginners3x3Method(mockModel)
        for(let i = 0; i < method.groups.length; i++) {
            expect(method.groups[i].length).toEqual(0)
        }
    })

    it('should not return empty hint', () => {
        const mockModel = {
            cubies: Array<Cubie>(),
            notifyMethodStep: vi.fn()
        } as unknown as CubeModel
        const method = new Beginners3x3Method(mockModel)
        expect(method.getHint().length).not.toEqual(0)
    })
})
