import * as THREE from 'three'

export class GeometryProvider {

    cubeSize: number
    dimension: number
    cubieSize: number

    faceGeometry: THREE.PlaneGeometry
    turnSideGeometry: THREE.PlaneGeometry

    constructor(cubeSize: number, dimension: number) {
        this.cubeSize = cubeSize
        this.dimension = dimension
        this.cubieSize = cubeSize / dimension
        this.faceGeometry = new THREE.PlaneGeometry(this.cubieSize, this.cubieSize)
        this.turnSideGeometry = new THREE.PlaneGeometry(this.cubeSize, this.cubeSize)
    }

    getFaceGeometry(): THREE.PlaneGeometry {
        return this.faceGeometry
    }

    getTurnSideGeometry(): THREE.PlaneGeometry {
        return this.turnSideGeometry
    }

    dispose(): void {
        this.faceGeometry.dispose()
        this.turnSideGeometry.dispose()
    }
}
