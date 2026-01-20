import * as THREE from "three";

export class ColorPicker {
    static readonly LEFT = new THREE.Color(185, 0, 0)
    static readonly RIGHT = new THREE.Color(255, 89, 0)
    static readonly UP = new THREE.Color(255, 255, 255)
    static readonly DOWN = new THREE.Color(255, 213, 0)
    static readonly FRONT = new THREE.Color(0, 155, 32)
    static readonly BACK = new THREE.Color(0, 69, 173)
    static readonly NON_VISIBLE = new THREE.Color(100, 100, 100)
    static readonly BACKGROUND = new THREE.Color(0, 0, 0)

    static getDefaultColors(): Array<THREE.Color> {
        return Array.of(this.LEFT, this.RIGHT, this.UP, this.DOWN, this.FRONT, this.BACK)
    }
}
