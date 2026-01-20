import {Cubie} from "../model/Cubie";
import {SceneView} from "./SceneView";
import * as THREE from "three";
import {StickerProvider} from "./utility/StickerProvider";

export class CubieView {

    cubie: Cubie
    dimension: number

    size: number
    offset: number
    mesh: THREE.Mesh

    stickerProvider: StickerProvider

    constructor(cubie: Cubie, dimension: number, stickerProvider: StickerProvider) {
        this.cubie = cubie
        this.dimension = dimension
        this.size = SceneView.cubeSize / dimension
        this.offset = (SceneView.cubeSize - this.size) / 2
        this.stickerProvider = stickerProvider
        this.mesh = this.setupMesh()
        this.updateFromModel()
    }

    updateFromModel(): void {
        const position: THREE.Vector3 = this.getCubiePosition()
        this.mesh.position.copy(position)
        const rotation: THREE.Matrix4 = this.getCubieRotation()
        this.mesh.setRotationFromMatrix(rotation)
        this.mesh.material = this.getMaterial()
    }

    private setupMesh(): THREE.Mesh {
        const geometry =  new THREE.BoxGeometry(this.size, this.size, this.size)
        const materials = this.getMaterial()
        const mesh = new THREE.Mesh(geometry, materials)
        mesh.userData.cubieView = this
        return mesh
    }

    private getMaterial(): Array<THREE.MeshBasicMaterial> {
        // Default to Background Color
        let material = Array(6).fill(this.stickerProvider.getMaterial())
        // Draw Stickers only on visible Faces
        for(let face of this.cubie.faces)
            material[face.side.index()] = this.stickerProvider.getMaterial(face)
        return material
    }

    private getCubiePosition(): THREE.Vector3 {
        const coordX: number = this.cubie.position.i * this.size - this.offset
        const coordY: number = this.cubie.position.j * this.size - this.offset
        const coordZ: number = this.cubie.position.k * this.size - this.offset
        return new THREE.Vector3(coordX, coordY, coordZ)
    }

    private getCubieRotation(): THREE.Matrix4 {
        const r = this.cubie.position.rotation
        const matrix = new THREE.Matrix3()
        matrix.set(
            r.xAxis.x, r.yAxis.x, r.zAxis.x,
            r.xAxis.y, r.yAxis.y, r.zAxis.y,
            r.xAxis.z, r.yAxis.z, r.zAxis.z
        )
        return new THREE.Matrix4().setFromMatrix3(matrix)
    }
}
