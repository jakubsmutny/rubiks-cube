import * as THREE from 'three';

export class StickerProvider {

    side: number;
    colors: Array<THREE.Color>;
    backgroundColor: THREE.Color;

    pixelCount: number;
    textures: Array<THREE.DataTexture>;

    constructor(dimension: number, colors?: Array<THREE.Color>, backgroundColor?: THREE.Color) {
        this.side = this.#getSideFromDimension(dimension);
        if(colors !== undefined) this.colors = colors;
        else this.colors = this.#getDefaultColors();
        if(backgroundColor !== undefined) this.backgroundColor = backgroundColor;
        else this.backgroundColor = new THREE.Color(0, 0, 0);
        this.pixelCount = this.side * this.side;

        this.textures = this.#createTextures();
    }

    #getSideFromDimension(dimension: number): number {
        let side: number = Math.ceil(10000 / (dimension * dimension));
        side = Math.min(side, 1000);
        side = Math.max(side, 25);
        return side;
    }

    #getDefaultColors(): Array<THREE.Color> {
        return [
            new THREE.Color(185, 0, 0),
            new THREE.Color(255, 89, 0),
            new THREE.Color(255, 255, 255),
            new THREE.Color(255, 213, 0),
            new THREE.Color(0, 155, 32),
            new THREE.Color(0, 69, 173)
        ];
    }

    #createTextures(): Array<THREE.DataTexture> {
        let textures = new Array<THREE.DataTexture>;
        for (let sideId = 0; sideId < 6; sideId++) {
            let pixels = new Uint8Array(this.pixelCount * 4);
            for (let i = 0; i < this.side; i++) for (let j = 0; j < this.side; j++) {
                let position = (i * this.side + j) * 4;
                let pickedColor = this.colors[sideId];
                if(this.#backgroundMask(i, j))
                    pickedColor = this.backgroundColor;
                this.#setPixelColor(pixels, position, pickedColor);
            }
            let texture = new THREE.DataTexture(pixels, this.side, this.side);
            texture.needsUpdate = true;
            textures.push(texture);
        }
        return textures;
    }

    #setPixelColor(data: Uint8Array, position: number, color: THREE.Color): void {
        data[position] = color.r;
        data[position + 1] = color.g;
        data[position + 2] = color.b;
        // Make the pixel not transparent
        data[position + 3] = 255;
    }

    #backgroundMask(row: number, column: number): boolean {
        let frame = Math.ceil(this.side / 25);
        let radius = Math.ceil(this.side / 8);
        let corner = frame + radius;
        let straight = this.side - (2 * corner);

        // Mark frame as background
        if(row < frame) return true;
        if(column < frame) return true;
        if(row >= this.side - frame) return true;
        if(column >= this.side - frame) return true;

        // Stop with rounded edges at low resolution (stops at 10x10 cube)
        if(this.side < 100) return false;
        if(straight < 0) return false;

        // Mark everything but corners as foreground
        if(row >= corner && row < this.side - corner) return false;
        if(column >= corner && column < this.side - corner) return false;

        // Create new 2D plane from corners and mark circle as foreground
        let y = row - corner; if(y > 0) y -= straight;
        let x = column - corner; if(x > 0) x -= straight;
        if(Math.pow(x, 2) + Math.pow(y, 2) < Math.pow(radius, 2)) return false;
        return true;
    }

    getStickerTexture(sideId: number): THREE.DataTexture {
        return this.textures[sideId];
    }

    getBackgroundColor(): THREE.Color {
        return this.backgroundColor;
    }
}
