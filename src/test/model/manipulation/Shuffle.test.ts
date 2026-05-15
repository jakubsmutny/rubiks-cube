import { describe, it, expect } from 'vitest'
import { Shuffle } from '../../../main/model/manipulation/Shuffle'
import { ShuffleFactory } from "../../../main/model/utility/factories/ShuffleFactory"

describe('Shuffle Class', () => {
    it('should create inverse shuffle of empty as also empty', () => {
        const empty = ShuffleFactory.createEmpty()
        const inversed = empty.getInverse()
        expect(inversed.isEmpty()).toBe(true)
    })

    it('should create empty shuffle when inverse is appended', () => {
        const shuffle: Shuffle = new ShuffleFactory(3).createRandom(20)
        const inversed: Shuffle = shuffle.getInverse()
        shuffle.append(inversed)
        expect(shuffle.isEmpty()).toBe(true)
    })

    it('should be same size as inversed move', () => {
        const shuffle: Shuffle = new ShuffleFactory(3).createRandom(20)
        const inversed: Shuffle = shuffle.getInverse()
        expect(shuffle.size()).toEqual(inversed.size())
    })

    it('should return same shuffle on double inverse', () => {
        const shuffle: Shuffle = new ShuffleFactory(3).createRandom(20)
        const inversed: Shuffle = shuffle.getInverse().getInverse()
        expect(inversed.equals(shuffle))
    })

    it('should be same as shuffle appended with empty shuffle', () => {
        const shuffle: Shuffle = new ShuffleFactory(3).createRandom(20)
        const empty: Shuffle = ShuffleFactory.createEmpty()
        const appended: Shuffle = shuffle.clone()
        appended.append(empty)
        expect(appended.equals(shuffle)).toBe(true)
    })

    it('should create from notation shuffle with correct move count', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createFromNotation("R U R U")
        expect(shuffle.size()).toEqual(4)
    })

    it('should create from notation empty shuffle', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createFromNotation("")
        expect(shuffle.isEmpty()).toBe(true)
    })

    it('should return normal speed when not fast', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createRandom(20)
        expect(shuffle.getSpeed()).toEqual(1)
    })

    it('should return bigger speed when made fast', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createRandom(20)
        shuffle.makeFast()
        expect(shuffle.getSpeed()).toBeGreaterThan(1)
    })

    it('should concatenate two concatenable moves into one', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createFromNotation("R")
        const appendable: Shuffle = sf.createFromNotation("R")
        shuffle.append(appendable)
        expect(shuffle.size()).toBeLessThan(2)
    })

    it('should treat whole move as empty', () => {
        const sf = new ShuffleFactory(3)
        const shuffle: Shuffle = sf.createFromNotation("R")
        const appendable: Shuffle = sf.createFromNotation("R")
        shuffle.append(appendable)
        shuffle.append(appendable)
        shuffle.append(appendable)
        expect(shuffle.isEmpty()).toBe(true)
    })
})
