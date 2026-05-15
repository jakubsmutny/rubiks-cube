import { describe, it, expect } from 'vitest'
import { Cubie } from "../../main/model/Cubie"
import { CubieFactory } from "../../main/model/utility/factories/CubieFactory"
import { CubePosition } from "../../main/model/utility/CubePosition"
import { Axis } from "../../main/model/utility/geometry/Axis"

describe('Cubie Class', () => {
    it('should return the correct layer for given axis', () => {
        const position: CubePosition = new CubePosition(3, 0, 1, 2)
        const cubie = new Cubie(position, [])
        expect(cubie.layerInAxis(Axis.X)).toEqual(0)
        expect(cubie.layerInAxis(Axis.Y)).toEqual(1)
        expect(cubie.layerInAxis(Axis.Z)).toEqual(2)
        expect(cubie.layerInAxis(Axis.undefined)).toEqual(-1)
    })

    it('should correctly indicate presence in layer in axis', () => {
        const position: CubePosition = new CubePosition(3, 0, 1, 2)
        const cubie = new Cubie(position, [])
        expect(cubie.inAxisLayers(Axis.X, [0, 1 , 2])).toBe(true)
        expect(cubie.inAxisLayers(Axis.X, [0])).toBe(true)
        expect(cubie.inAxisLayers(Axis.X, [])).toBe(false)
        expect(cubie.inAxisLayers(Axis.X, [1, 2])).toBe(false)
    })

    it('should create the correct number of cubies for every dimension', () => {
        for(let dimension = 1; dimension <= 20; dimension++) {
            const cubies = CubieFactory.createCubies(dimension)
            expect(cubies.length).toEqual((dimension ** 3) - Math.max(((dimension - 2) ** 3), 0))
        }
    })

    it('should not create cubies without faces', () => {
        for(let dimension = 1; dimension <= 20; dimension++) {
            const cubies = CubieFactory.createCubies(dimension)
            for(let cubie of cubies) {
                expect(cubie.faces.length).toBeGreaterThan(0)
            }
        }
    })
})
