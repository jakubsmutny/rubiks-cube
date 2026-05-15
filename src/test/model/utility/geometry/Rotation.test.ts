import { describe, it, expect } from 'vitest'
import {Rotation} from "../../../../main/model/utility/geometry/Rotation"
import {RotationFactory} from "../../../../main/model/utility/factories/RotationFactory"
import {Vector} from "../../../../main/model/utility/geometry/Vector"

describe('Rotation Class', () => {
    it('should rotate vector', () => {
        const rotation: Rotation = RotationFactory.getRoll()
        const original: Vector = new Vector(1, 2, 3)
        const rolled: Vector = rotation.appliedToVector(original)
        expect(rolled.x).toEqual(original.x)
        expect(rolled.y).not.toEqual(original.y)
        expect(rolled.z).not.toEqual(original.z)
    })

    it('should be same after double transposition', () => {
        const rotation: Rotation = RotationFactory.getPitch()
        const newRotation: Rotation = rotation.transposed().transposed()
        expect(newRotation.equals(rotation)).toBe(true)
    })

    it('should rotate zero rotation', () => {
        const rotation: Rotation = RotationFactory.getYaw()
        const defaultRotation: Rotation = RotationFactory.getDefaultRotation()
        const newRotation: Rotation = rotation.appliedToRotation(defaultRotation)
        expect(newRotation.equals(rotation)).toBe(true)
    })

    it('should transpose orthogonal rotation to be inverse', () => {
        const orthogonal: Rotation = RotationFactory.getDefaultRotation()
                                     .appliedToRotation(RotationFactory.getRoll())
                                     .appliedToRotation(RotationFactory.getPitch())
                                     .appliedToRotation(RotationFactory.getYaw())
        const transposed: Rotation = orthogonal.transposed()
        const defaultRotation: Rotation = RotationFactory.getDefaultRotation()
        const applied: Rotation = defaultRotation.appliedToRotation(orthogonal).appliedToRotation(transposed)
        expect(defaultRotation.equals(applied)).toBe(true)
    })

    it('should not change orthogonal rotation when snapped to grid', () => {
        const orthogonal: Rotation = RotationFactory.getDefaultRotation()
                                     .appliedToRotation(RotationFactory.getRoll())
                                     .appliedToRotation(RotationFactory.getPitch())
                                     .appliedToRotation(RotationFactory.getYaw())
        const snapped: Rotation = orthogonal.snappedToGrid()
        expect(orthogonal.equals(snapped)).toBe(true)
    })

    it('should correctly clone rotation', () => {
        const original: Rotation = RotationFactory.getYaw()
        const cloned: Rotation = original.clone()
        expect(cloned.equals(original)).toBe(true)
    })

    it('should be correctly created by factory when creating pitch', () => {
        const axis: Vector = new Vector(0, 1, 0)
        const created: Rotation = RotationFactory.getRotation(axis, 1)
        const pitch: Rotation = RotationFactory.getPitch()
        expect(created.equals(pitch)).toBe(true)
    })

    it('should create default rotation when rotating 2PI', () => {
        const axis: Vector = new Vector(0, 0, 1)
        const created: Rotation = RotationFactory.getRotation(axis, 4)
        const defaultRotation: Rotation = RotationFactory.getDefaultRotation()
        expect(created.equals(defaultRotation)).toBe(true)
    })
})
