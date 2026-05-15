import { describe, it, expect } from 'vitest'
import {Vector} from "../../../../main/model/utility/geometry/Vector"
import {Axis} from "../../../../main/model/utility/geometry/Axis"

describe('Vector Class', () => {
    it('should be cloned correctly', () => {
        const random: Vector = new Vector(Math.random(), Math.random(), Math.random())
        const cloned: Vector = random.clone()
        expect(cloned.equals(random)).toBe(true)
    })

    it('should be same when double negative', () => {
        const random: Vector = new Vector(Math.random(), Math.random(), Math.random())
        const newVector: Vector = random.negative().negative()
        expect(newVector.equals(random)).toBe(true)
    })

    it('should create z axis from cross x y', () => {
        const zAxis: Vector = Axis.Z
        const cross: Vector = Axis.X.cross(Axis.Y)
        expect(cross.equals(zAxis)).toBe(true)
    })

    it('should not create z axis from cross y x', () => {
        const zAxis: Vector = Axis.Z
        const cross: Vector = Axis.Y.cross(Axis.X)
        expect(cross.equals(zAxis)).toBe(false)
    })

    it('should calculate dot product of two orthogonal vectors to 0', () => {
        const dotProduct: number = Axis.X.dot(Axis.Y)
        expect(dotProduct).toEqual(0)
    })

    it('should not calculate dot product of two same vectors to 0', () => {
        const dotProduct: number = Axis.X.dot(Axis.X)
        expect(dotProduct).not.toEqual(0)
    })

    it('should not calculate dot product of two negative vectors to 0', () => {
        const dotProduct: number = Axis.X.dot(Axis.X.negative())
        expect(dotProduct).not.toEqual(0)
    })

    it('should correctly snap to grid', () => {
        const vector: Vector = new Vector(1, 0.5, 0.5).snappedToGrid()
        expect(vector).toEqual(Axis.X)
    })

    it('should correctly snap to grid with exclusion', () => {
        const vector: Vector = new Vector(1, 0.8, 0.5).snappedToGrid(Axis.X)
        expect(vector).toEqual(Axis.Y)
    })
})
