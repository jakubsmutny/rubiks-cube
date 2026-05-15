import { describe, it, expect } from 'vitest'
import { CubieView } from "../../main/view/CubieView"
import { GeometryProvider } from "../../main/view/utility/GeometryProvider"
import { MaterialProvider } from "../../main/view/utility/MaterialProvider"
import { Cubie } from "../../main/model/Cubie";
import { CubePosition } from "../../main/model/utility/CubePosition"
import { RotationFactory } from "../../main/model/utility/factories/RotationFactory"
import { FaceFactory } from "../../main/model/utility/factories/FaceFactory"

function setCubieView(dimension: number): CubieView {
    const gp = new GeometryProvider(1, dimension)
    const mp = new MaterialProvider(dimension)
    const position = new CubePosition(dimension, 0,1, 2, RotationFactory.getRoll())
    const cubie = new Cubie(position, FaceFactory.createFaces(position, dimension))
    return new CubieView(cubie, dimension, mp, gp)
}

describe('CubieView Class', () => {
    it('should create two meshes for every face', () => {
        const cubieView = setCubieView(3)
        const faceNumber = cubieView.cubie.faces.length
        const meshGroupSize = cubieView.meshGroup.children.length
        expect(meshGroupSize === 2 * faceNumber).toBe(true)
    })

    it('should be equal to whole cube size when added wit all cubie views', () => {
        const dimension = 20
        const cubieView = setCubieView(dimension)
        expect(cubieView.size * dimension).toEqual(1)
    })
})
