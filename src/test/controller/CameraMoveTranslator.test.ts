import { describe, it, expect } from 'vitest'
import {CameraMoveTranslator} from "../../main/controller/CameraMoveTranslator"
import * as THREE from 'three'
import {Move} from "../../main/model/manipulation/Move"
import {MoveFactory} from "../../main/model/utility/factories/MoveFactory"
import {Shuffle} from "../../main/model/manipulation/Shuffle"

describe('CameraMoveTranslator Class', () => {
    it('should not change move when not rotated', () => {
        const mockMatrix = new THREE.Matrix4()
        const mockCamera = {
            matrixWorld: mockMatrix
        } as THREE.PerspectiveCamera
        const dimension = 3
        const translator: CameraMoveTranslator = new CameraMoveTranslator(mockCamera, dimension)
        const moveFactory = new MoveFactory(dimension)
        const move: Move = moveFactory.createRandom()
        const newMove: Move = translator.translateMove(move)
        expect(newMove.equals(move)).toBe(true)
    })

    it('should change move when rotated', () => {
        const mockMatrix = new THREE.Matrix4().makeRotationY(Math.PI / 2)
        const mockCamera = {
            matrixWorld: mockMatrix
        } as THREE.PerspectiveCamera
        const dimension = 3
        const translator: CameraMoveTranslator = new CameraMoveTranslator(mockCamera, dimension)
        const moveFactory = new MoveFactory(dimension)
        const move: Move = moveFactory.createFromNotation("R")
        const newMove: Move = translator.translateMove(move)
        expect(newMove.equals(move)).toBe(false)
    })

    it('should not change move when rotated around moves axis', () => {
        const mockMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2)
        const mockCamera = {
            matrixWorld: mockMatrix
        } as THREE.PerspectiveCamera
        const dimension = 3
        const translator: CameraMoveTranslator = new CameraMoveTranslator(mockCamera, dimension)
        const moveFactory = new MoveFactory(dimension)
        const move: Move = moveFactory.createFromNotation("R")
        const newMove: Move = translator.translateMove(move)
        expect(newMove.equals(move)).toBe(true)
    })

    it('should not change move when rotated below PI/4', () => {
        const mockMatrix = new THREE.Matrix4().makeRotationY(Math.PI / 8)
        const mockCamera = {
            matrixWorld: mockMatrix
        } as THREE.PerspectiveCamera
        const dimension = 3
        const translator: CameraMoveTranslator = new CameraMoveTranslator(mockCamera, dimension)
        const moveFactory = new MoveFactory(dimension)
        const move: Move = moveFactory.createFromNotation("R")
        const newMove: Move = translator.translateMove(move)
        expect(newMove.equals(move)).toBe(true)
    })

    it('should change move same way as shuffle of the move', () => {
        const mockMatrix = new THREE.Matrix4().makeRotationX(Math.random()).makeRotationY(Math.random()).makeRotationZ(Math.random())
        const mockCamera = {
            matrixWorld: mockMatrix
        } as THREE.PerspectiveCamera
        const dimension = 3
        const translator: CameraMoveTranslator = new CameraMoveTranslator(mockCamera, dimension)
        const moveFactory = new MoveFactory(dimension)
        const move: Move = moveFactory.createRandom()
        const shuffle: Shuffle = new Shuffle([move], false)
        const newMove: Move = translator.translateMove(move)
        const newShuffle: Shuffle = translator.translateShuffle(shuffle)
        expect(newMove.equals(newShuffle.moves[0])).toBe(true)
    })
})
