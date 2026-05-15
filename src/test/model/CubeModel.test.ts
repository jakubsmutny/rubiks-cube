import { describe, it, expect } from 'vitest'
import { CubeModel } from "../../main/model/CubeModel"
import { ShuffleFactory } from "../../main/model/utility/factories/ShuffleFactory"

describe('CubeModel Class', () => {
    it('should be created in solved state', () => {
        const model: CubeModel = new CubeModel(3)
        expect(model.isSolved()).toBe(true)
    })

    it('should not be solved after scrambling', () => {
        const model: CubeModel = new CubeModel(3)
        model.scramble()
        expect(model.isSolved()).toBe(false)
    })

    it('should be solved after scrambling and then solving', () => {
        const model: CubeModel = new CubeModel(4)
        model.scramble()
        model.solve()
        expect(model.isSolved()).toBe(true)
    })

    it('should be solved after scrambling and then undoing', () => {
        const model: CubeModel = new CubeModel(3)
        model.scramble()
        model.undo()
        expect(model.isSolved()).toBe(true)
    })

    it('should not be solved after scrambling and then undoing and redoing', () => {
        const model: CubeModel = new CubeModel(3)
        model.scramble()
        model.undo()
        model.redo()
        expect(model.isSolved()).toBe(false)
    })

    it('should be solved after performing the sexy move six times', () => {
        const model: CubeModel = new CubeModel(3)
        for(let i = 0; i < 6; i++) {
            model.manipulate(new ShuffleFactory(3).createFromNotation("R U R' U'"))
        }
        expect(model.isSolved()).toBe(true)
    })

    it('should not be solved after performing random manipulation', () => {
        const model: CubeModel = new CubeModel(5)
        model.manipulate(new ShuffleFactory(5).createRandom(20))
        expect(model.isSolved()).toBe(false)
    })
})
