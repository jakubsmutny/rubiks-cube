import { describe, it, expect } from 'vitest'
import { Face } from "../../main/model/Face"
import { FaceFactory } from "../../main/model/utility/factories/FaceFactory"
import { CubePosition } from "../../main/model/utility/CubePosition"
import { UpSide } from "../../main/model/utility/side/UpSide"
import { RotationFactory } from "../../main/model/utility/factories/RotationFactory"

describe('Face Class', () => {
    it('should return visible to be true by default', () => {
        const face: Face = new Face(UpSide.get())
        expect(face.visible).toBe(true)
    })

    it('should rotate the normal of upside when rolling', () => {
        const face: Face = new Face(UpSide.get())
        const rotation = RotationFactory.getRoll()
        face.rotate(rotation)
        expect(face.normal.equals(UpSide.get().getNormal())).toBe(false)
    })

    it('should not rotate the normal of upside when pitching', () => {
        const face: Face = new Face(UpSide.get())
        const rotation = RotationFactory.getPitch()
        face.rotate(rotation)
        expect(face.normal.equals(UpSide.get().getNormal())).toBe(true)
    })

    it('should not create a face in cube center', () => {
        const dimension = 3
        const cubePosition = new CubePosition(dimension, 1, 1, 1)
        const faces = FaceFactory.createFaces(cubePosition, dimension)
        expect(faces.length).toEqual(0)
    })

    it('should create one face for center cubie', () => {
        const dimension = 3
        const cubePosition = new CubePosition(dimension, 0, 1, 1)
        const faces = FaceFactory.createFaces(cubePosition, dimension)
        expect(faces.length).toEqual(1)
    })

    it('should create two faces for edge cubie', () => {
        const dimension = 3
        const cubePosition = new CubePosition(dimension, 0, 0, 1)
        const faces = FaceFactory.createFaces(cubePosition, dimension)
        expect(faces.length).toEqual(2)
    })

    it('should create three faces for corner cubie', () => {
        const dimension = 3
        const cubePosition = new CubePosition(dimension, 0, 0, 0)
        const faces = FaceFactory.createFaces(cubePosition, dimension)
        expect(faces.length).toEqual(3)
    })
})
