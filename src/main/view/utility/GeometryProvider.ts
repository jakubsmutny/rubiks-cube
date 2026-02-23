import * as THREE from 'three'

export class GeometryProvider {

    cubieSize: number

    boxGeometry: THREE.BoxGeometry
    planeGeometry: THREE.PlaneGeometry

    constructor(cubieSize: number) {
        this.cubieSize = cubieSize
        this.boxGeometry = new THREE.BoxGeometry(this.cubieSize, this.cubieSize, this.cubieSize)
        this.planeGeometry = new THREE.PlaneGeometry(this.cubieSize, this.cubieSize)
    }

    getBoxGeometry(): THREE.BoxGeometry {
        return this.boxGeometry
    }

    getPlaneGeometry(): THREE.PlaneGeometry {
        return this.planeGeometry
    }
}
