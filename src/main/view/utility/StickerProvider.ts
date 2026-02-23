import * as THREE from 'three'
import {Face} from "../../model/Face"
import {ColorPicker} from "./ColorPicker";

export class StickerProvider {

    colors: Array<THREE.Color>
    backgroundColor: THREE.Color
    nonVisibleColor: THREE.Color

    side: number
    pixelCount: number

    withBackgroundTextures: Array<THREE.DataTexture>
    clearTextures: Array<THREE.DataTexture>

    constructor(dimension: number, colors?: Array<THREE.Color>, backgroundColor?: THREE.Color, nonVisibleColor?: THREE.Color) {
        if(!colors) colors = ColorPicker.getDefaultColors()
        this.colors = colors
        if(!backgroundColor) backgroundColor = ColorPicker.BACKGROUND
        this.backgroundColor = backgroundColor
        if(!nonVisibleColor) nonVisibleColor = ColorPicker.NON_VISIBLE
        this.nonVisibleColor = nonVisibleColor

        this.side = this.getSideFromDimension(dimension)
        this.pixelCount = this.side * this.side;

        this.withBackgroundTextures = this.createTextures()
        this.clearTextures = this.createTextures(true)
    }

    getStickerMaterial(face?: Face, clear: boolean = false): THREE.MeshBasicMaterial {
        if(face === undefined)
            return new THREE.MeshBasicMaterial({color: this.getBackgroundColor(), transparent: clear, opacity: (clear ? 0 : 1)})
        return new THREE.MeshBasicMaterial({map: this.getStickerTexture(face, clear), transparent: clear, opacity: (clear ? 0.5 : 1)})
    }

    private getStickerTexture(face: Face, clear: boolean): THREE.DataTexture {
        let textures = this.withBackgroundTextures
        if(clear) textures = this.clearTextures
        if(!face.visible) return textures[this.colors.length]
        return textures[face.side.index()]
    }

    private getBackgroundColor(): THREE.Color {
        return this.backgroundColor
    }

    private getSideFromDimension(dimension: number): number {
        let side: number = Math.ceil(10000 / (dimension * dimension))
        side = Math.min(side, 1000)
        side = Math.max(side, 25)
        return side
    }

    private createTextures(clear: boolean = false): Array<THREE.DataTexture> {
        let textures = new Array<THREE.DataTexture>
        for(let color of [...this.colors, this.nonVisibleColor]) {
            let pixels = new Uint8Array(this.pixelCount * 4)
            for (let i = 0; i < this.side; i++) for (let j = 0; j < this.side; j++) {
                let position = (i * this.side + j) * 4
                let pickedColor = color
                if(this.backgroundMask(i, j))
                    pickedColor = this.backgroundColor
                this.setPixelColor(pixels, position, pickedColor, clear)
            }
            let texture = new THREE.DataTexture(pixels, this.side, this.side)
            texture.needsUpdate = true
            textures.push(texture)
        }
        return textures
    }

    private setPixelColor(data: Uint8Array, position: number, color: THREE.Color, clear: boolean): void {
        data[position] = color.r
        data[position + 1] = color.g
        data[position + 2] = color.b
        data[position + 3] = clear && color.equals(this.backgroundColor) ? 0 : 255
    }

    private backgroundMask(row: number, column: number): boolean {
        let frame = Math.ceil(this.side / 25)
        let radius = Math.ceil(this.side / 8)
        let corner = frame + radius
        let straight = this.side - (2 * corner)

        // Mark frame as a background
        if(row < frame) return true
        if(column < frame) return true
        if(row >= this.side - frame) return true
        if(column >= this.side - frame) return true

        // Stop with rounded edges at low resolution (stops at 10x10 cube)
        if(this.side < 100) return false
        if(straight < 0) return false

        // Mark everything but corners as foreground
        if(row >= corner && row < this.side - corner) return false
        if(column >= corner && column < this.side - corner) return false

        // Create a new 2D plane from corners and mark circle as foreground
        let y = row - corner; if(y > 0) y -= straight
        let x = column - corner; if(x > 0) x -= straight
        if(Math.pow(x, 2) + Math.pow(y, 2) < Math.pow(radius, 2)) return false
        return true
    }
}
