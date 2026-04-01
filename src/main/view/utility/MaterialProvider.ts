import * as THREE from 'three'
import {Face} from "../../model/Face"
import {ColorPicker} from "./ColorPicker"
import {Side} from "../../model/utility/side/Side"

export class MaterialProvider {

    colors: Array<THREE.Color>
    backgroundColor: THREE.Color

    dimension: number
    side: number
    pixelCount: number

    withBackgroundTextures: Array<THREE.DataTexture>
    clearTextures: Array<THREE.DataTexture>

    withBackgroundMaterials: Array<THREE.MeshBasicMaterial>
    clearMaterials: Array<THREE.MeshBasicMaterial>

    backgroundMaterial: THREE.MeshBasicMaterial

    constructor(dimension: number) {
        this.colors = new Array<THREE.Color>()
        for(let side of Side.getAll())
            this.colors.push(ColorPicker.getColor(side))
        this.colors.push(ColorPicker.NON_VISIBLE)
        this.backgroundColor = ColorPicker.BACKGROUND

        this.dimension = dimension
        this.side = this.getSideFromDimension(dimension)
        this.pixelCount = this.side * this.side;

        this.withBackgroundTextures = this.createTextures()
        this.clearTextures = this.createTextures(true)

        this.withBackgroundMaterials = this.createMaterials()
        this.clearMaterials = this.createMaterials(true)
        this.backgroundMaterial = new THREE.MeshBasicMaterial({color: this.backgroundColor})
    }

    getMaterial(face: Face, clear: boolean = false): THREE.MeshBasicMaterial {
        let materials = this.withBackgroundMaterials
        if(clear) materials = this.clearMaterials
        return materials[this.faceToColorIndex(face)]
    }

    getBackgroundMaterial(): THREE.MeshBasicMaterial {
        return this.backgroundMaterial
    }

    private getSideFromDimension(dimension: number): number {
        let side: number = Math.ceil(10000 / (dimension * dimension))
        side = Math.min(side, 1000)
        side = Math.max(side, 25)
        return side
    }

    private faceToColorIndex(face: Face): number {
        if(!face.visible) return this.colors.length - 1
        return face.side.index()
    }

    private createMaterials(clear: boolean = false): Array<THREE.MeshBasicMaterial> {
        let materials = new Array<THREE.MeshBasicMaterial>
        let textures = this.withBackgroundTextures
        if(clear) textures = this.clearTextures
        for(let texture of textures) {
            materials.push(new THREE.MeshBasicMaterial({map: texture, transparent: clear, opacity: (clear ? 0.5 : 1)}))
        }
        return materials
    }

    private createTextures(clear: boolean = false): Array<THREE.DataTexture> {
        let textures = new Array<THREE.DataTexture>
        for(let color of this.colors) {
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
        // Stop with frame at low resolution (stops at 50x50 cube)
        if(this.dimension > 50) return false

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

    dispose(): void {
        this.withBackgroundTextures.forEach(texture => texture.dispose())
        this.clearTextures.forEach(texture => texture.dispose())
        this.withBackgroundMaterials.forEach(material => material.dispose())
        this.clearMaterials.forEach(material => material.dispose())
        this.backgroundMaterial.dispose()
    }
}
