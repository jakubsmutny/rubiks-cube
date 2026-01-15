import { describe, it, expect } from 'vitest';
import {Rotation} from "../../../main/model/geometry/Rotation";
import {RotationFactory} from "../../../main/model/factories/RotationFactory";
import {Vector} from "../../../main/model/geometry/Vector";

describe('Rotation Class', () => {
    it('should roll vector', () => {
        const rotation: Rotation = RotationFactory.getRoll()
        const original: Vector = new Vector(1, 2, 3)
        const rolled: Vector = rotation.appliedToVector(original)
        expect(rolled.x).toEqual(original.x)
        expect(rolled.y).not.toEqual(original.y)
        expect(rolled.z).not.toEqual(original.z)
    })
})
