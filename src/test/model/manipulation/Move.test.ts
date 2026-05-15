import { describe, it, expect } from 'vitest'
import { Move } from '../../../main/model/manipulation/Move'
import { MoveFactory } from "../../../main/model/utility/factories/MoveFactory"
import {Axis} from "../../../main/model/utility/geometry/Axis"

describe('Move Class', () => {
    it('should translate steps to {-1, 0, 1, 2}', () => {
        const expected: number = 2
        const input: number = -2
        const result = Move['normalizeSteps'](input)
        expect(result).toEqual(expected)
    })

    it('should equal to a cloned move', () => {
        const move = new MoveFactory(3).createRandom()
        const clonedMove = move.clone()
        expect(move).toEqual(clonedMove)
    })

    it('should equal to a double inversed move', () => {
        const move = new MoveFactory(3).createRandom()
        const inversedMove = move.getInverse().getInverse()
        expect(move).toEqual(inversedMove)
    })

    it('should be concatenable with inversed move', () => {
        const move = new MoveFactory(3).createRandom()
        const inversedMove = move.getInverse()
        expect(move.isConcatenableWith(inversedMove)).toBe(true)
    })

    it('should not be concatenable with move with different axis', () => {
        const first: Move = new Move(Axis.X, [0], 1)
        const second:Move = new Move(Axis.Y, [0], 1)
        expect(first.isConcatenableWith(second)).toBe(false)
    })

    it('should be concatenate with inversed move to create empty move', () => {
        const move = new MoveFactory(3).createRandom()
        const inversedMove = move.getInverse()
        const concatenated = move.concatenate(inversedMove)
        expect(concatenated.isEmpty()).toBe(true)
    })

    it('should be empty when creating empty move with factory', () => {
        const move = MoveFactory.createEmpty()
        expect(move.isEmpty()).toBe(true)
    })

    it('should reduce turn size to interval (-2,2]', () => {
        expect(Move.reduceTurn(2)).toEqual(2)
        expect(Move.reduceTurn(-2)).toEqual(2)
        expect(Move.reduceTurn(-6)).toEqual(2)
        expect(Move.reduceTurn(1)).toEqual(1)
        expect(Move.reduceTurn(0)).toEqual(0)
        expect(Move.reduceTurn(4)).toEqual(0)
    })

    it('should return steps transformed interval (0,4]', () => {
        const move: Move = new Move(Axis.X, [0], -1)
        expect(move.getPositiveSteps()).toEqual(3)
    })

    it('should correctly test input text notations', () => {
        const mf: MoveFactory = new MoveFactory(3)
        expect(mf.isNotationValid("invalid notation")).toBe(false)
        expect(mf.isNotationValid("R")).toBe(true)
        expect(mf.isNotationValid("2Rw")).toBe(true)
        expect(mf.isNotationValid("2u")).toBe(true)
        expect(mf.isNotationValid("F'")).toBe(true)
        expect(mf.isNotationValid("B2")).toBe(true)
        expect(mf.isNotationValid("N")).toBe(false)
        expect(mf.isNotationValid("2D")).toBe(true)
        expect(mf.isNotationValid("3D")).toBe(true)
    })

    it('should check for notation to exceed cube size', () => {
        const mf: MoveFactory = new MoveFactory(5)
        expect(mf.isNotationValid("5R")).toBe(true)
        expect(mf.isNotationValid("6R")).toBe(false)
    })

    it('should create wide moves with multiple planes and non wide moves with one layer', () => {
        const dimension: number = 20
        const mf: MoveFactory = new MoveFactory(dimension)
        for (let i = 0; i < dimension; i++) {
            expect(mf.createFromNotation(dimension.toString() + "Rw").planes.length).toEqual(dimension)
            expect(mf.createFromNotation(dimension.toString() + "R").planes.length).toEqual(1)
        }
    })

    it('should create opposite moves with same axis', () => {
        const mf: MoveFactory = new MoveFactory(3)
        expect(mf.createFromNotation("R").axis).toEqual(mf.createFromNotation("L").axis)
        expect(mf.createFromNotation("U").axis).toEqual(mf.createFromNotation("D").axis)
        expect(mf.createFromNotation("F").axis).toEqual(mf.createFromNotation("B").axis)
    })

    it('should create opposite move when picking last layer counter clockwise', () => {
        const mf: MoveFactory = new MoveFactory(3)
        expect(mf.createFromNotation("3R'")).toEqual(mf.createFromNotation("L"))
    })

    it('should not create empty move on random move creation', () => {
        const mf: MoveFactory = new MoveFactory(3)
        expect(mf.createRandom().isEmpty()).toBe(false)
    })
})
