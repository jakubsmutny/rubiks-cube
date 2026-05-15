import { describe, it, expect } from 'vitest'
import { CubePosition } from "../../../main/model/utility/CubePosition"
import { RotationFactory } from "../../../main/model/utility/factories/RotationFactory"
import { MoveFactory } from "../../../main/model/utility/factories/MoveFactory"

describe('CubePosition Class', () => {
    it('should equal cloned position', () => {
        const position: CubePosition = new CubePosition(3, 0, 1, 2, RotationFactory.getRoll())
        const cloned: CubePosition = position.clone()
        expect(cloned.equals(position)).toBe(true)
    })

    it('should detect when it is affected by move', () => {
        const position: CubePosition = new CubePosition(3, 0, 0, 0, RotationFactory.getRoll())
        const moveL = new MoveFactory(3).createFromNotation("L")
        const moveD = new MoveFactory(3).createFromNotation("D")
        const moveB = new MoveFactory(3).createFromNotation("B")
        expect(position.isAffectedBy(moveL)).toBe(true)
        expect(position.isAffectedBy(moveD)).toBe(true)
        expect(position.isAffectedBy(moveB)).toBe(true)
    })

    it('should detect when it is not affected by move', () => {
        const position: CubePosition = new CubePosition(3, 0, 0, 0, RotationFactory.getRoll())
        const moveR = new MoveFactory(3).createFromNotation("R")
        const moveU = new MoveFactory(3).createFromNotation("U")
        const moveF = new MoveFactory(3).createFromNotation("F")
        expect(position.isAffectedBy(moveR)).toBe(false)
        expect(position.isAffectedBy(moveU)).toBe(false)
        expect(position.isAffectedBy(moveF)).toBe(false)
    })

    it('should change after affecting move is applied', () => {
        const position: CubePosition = new CubePosition(3, 0, 0, 0, RotationFactory.getRoll())
        const move = new MoveFactory(3).createFromNotation("L")
        const newPosition = position.apply(move)
        expect(newPosition.equals(position)).toBe(false)
    })

    it('should not change after non affecting move is applied', () => {
        const position: CubePosition = new CubePosition(3, 0, 0, 0, RotationFactory.getRoll())
        const move = new MoveFactory(3).createFromNotation("R")
        const newPosition = position.apply(move)
        expect(newPosition.equals(position)).toBe(true)
    })
})
