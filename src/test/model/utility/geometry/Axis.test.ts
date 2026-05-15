import { describe, it, expect } from 'vitest'
import {Vector} from "../../../../main/model/utility/geometry/Vector"
import {Axis} from "../../../../main/model/utility/geometry/Axis"

describe('Axis Class', () => {
    it('should return two orthogonal vectors', () => {
        const pair: [Vector, Vector] = Axis.getOrthogonal(Axis.X)
        expect(pair[0].equals(Axis.Y)).toBe(true)
        expect(pair[1].equals(Axis.Z)).toBe(true)
    })

    it('should not return two orthogonal vectors when it is not axis', () => {
        const pair: [Vector, Vector] = Axis.getOrthogonal(new Vector(1, 1, 1))
        expect(pair[0].equals(Axis.undefined)).toBe(true)
        expect(pair[1].equals(Axis.undefined)).toBe(true)
    })

    it('should detect negative axis', () => {
        const axis: Vector = Axis.X.negative()
        expect(Axis.isNegative(axis)).toBe(true)
    })

    it('should detect non-negative axis', () => {
        const axis: Vector = Axis.Y
        expect(Axis.isNegative(axis)).toBe(false)
    })
})
