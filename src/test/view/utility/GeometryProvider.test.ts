import { describe, it, expect } from 'vitest'
import { GeometryProvider } from "../../../main/view/utility/GeometryProvider"

describe('GeometryProvider Class', () => {
    it('should create turn side geometry dimension times wider than face geometry', () => {
        const dimension = 5
        const gp = new GeometryProvider(1, dimension)
        const faceGeo = gp.getFaceGeometry()
        const turnSideGeo = gp.getTurnSideGeometry()
        expect(faceGeo.parameters.width * dimension).toEqual(turnSideGeo.parameters.width)
        gp.dispose()
    })

    it('should create a square for face geometry', () => {
        const dimension = 12
        const gp = new GeometryProvider(1, dimension)
        const faceGeo = gp.getFaceGeometry()
        expect(faceGeo.parameters.width).toEqual(faceGeo.parameters.height)
        gp.dispose()
    })

    it('should create a square for turn side geometry', () => {
        const dimension = 12
        const gp = new GeometryProvider(1, dimension)
        const turnSideGeo = gp.getTurnSideGeometry()
        expect(turnSideGeo.parameters.width).toEqual(turnSideGeo.parameters.height)
        gp.dispose()
    })

    it('should create turn side geometry with bigger or same area as face geometry', () => {
        for(let dimension = 1; dimension <= 20; dimension++) {
            const gp = new GeometryProvider(1, dimension)
            const faceGeo = gp.getFaceGeometry()
            const faceArea = faceGeo.parameters.width * faceGeo.parameters.height
            const turnSideGeo = gp.getTurnSideGeometry()
            const turnSideArea = turnSideGeo.parameters.width * turnSideGeo.parameters.height
            expect(faceArea).toBeLessThanOrEqual(turnSideArea)
            gp.dispose()
        }
    })
})
