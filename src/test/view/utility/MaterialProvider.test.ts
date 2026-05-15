import { describe, it, expect } from 'vitest'
import { MaterialProvider } from "../../../main/view/utility/MaterialProvider"

describe('MaterialProvider Class', () => {
    it('should create smaller resolution materials with bigger dimension of the cube', () => {
        for(let dimension = 1; dimension < 20; dimension++) {
            const mpBigger = new MaterialProvider(dimension)
            const mpSmaller = new MaterialProvider(dimension + 1)
            expect(mpSmaller.side).toBeLessThanOrEqual(mpBigger.side)
            mpSmaller.dispose()
            mpBigger.dispose()
        }
    })

    it('should have pixel count as second power of side', () => {
            const mp = new MaterialProvider(10)
            expect(mp.pixelCount).toEqual(mp.side * mp.side)
            mp.dispose()
    })

    it('should have the same number of clear as with background materials', () => {
        const mp = new MaterialProvider(10)
        expect(mp.withBackgroundTextures.length).toEqual(mp.clearMaterials.length)
        mp.dispose()
    })

    it('should not background mask at center of the material', () => {
        const mp = new MaterialProvider(10)
        const halfSide = mp.side / 2
        expect((mp as any).backgroundMask(halfSide, halfSide)).toBe(false)
        mp.dispose()
    })

    it('should not have background mask in dimensions over 50', () => {
        const mp = new MaterialProvider(51)
        expect((mp as any).backgroundMask(0, 0)).toBe(false)
        mp.dispose()
    })

    it('should have background mask in dimensions under 50', () => {
        const mp = new MaterialProvider(49)
        expect((mp as any).backgroundMask(0, 0)).toBe(true)
        mp.dispose()
    })

    it('should create background as a frame around the square', () => {
        const mp = new MaterialProvider(3)
        const last = mp.side - 1
        for(let i = 0; i < mp.side; i++)
            for(let j = 0; j < mp.side; j++)
                if(i === 0 || i === last || j === 0 || j === last)
                    expect((mp as any).backgroundMask(i, j)).toBe(true)
        mp.dispose()
    })
})
