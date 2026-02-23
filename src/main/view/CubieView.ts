import {Cubie} from "../model/Cubie";
import {SceneView} from "./SceneView";
import * as THREE from "three";
import {StickerProvider} from "./utility/StickerProvider";
import {GeometryProvider} from "./utility/GeometryProvider";
import {Vector} from "../model/geometry/Vector";

export class CubieView {

    cubie: Cubie
    dimension: number

    size: number
    offset: number
    meshGroup: THREE.Group

    stickerProvider: StickerProvider
    geometryProvider: GeometryProvider

    constructor(cubie: Cubie, dimension: number, stickerProvider: StickerProvider, geometryProvider: GeometryProvider) {
        this.cubie = cubie
        this.dimension = dimension
        this.size = SceneView.cubeSize / dimension
        this.offset = (SceneView.cubeSize - this.size) / 2
        this.stickerProvider = stickerProvider
        this.geometryProvider = geometryProvider
        this.meshGroup = new THREE.Group()
        this.setupMeshes()
        this.updatePositionFromModel()
    }

    updatePositionFromModel(): void {
        const position: THREE.Vector3 = this.getCubiePosition()
        this.meshGroup.position.copy(position)
        const rotation: THREE.Matrix4 = this.getCubieRotation()
        this.meshGroup.setRotationFromMatrix(rotation)
    }

    private setupMeshes(): void {
        this.setupCoreMesh()
        this.setupMirrorMeshes()
    }

    private setupCoreMesh(): void {
        const geometry =  this.geometryProvider.getBoxGeometry()
        const materials = this.getMaterial()
        const coreMesh = new THREE.Mesh(geometry, materials)
        coreMesh.userData.cubieView = this
        this.meshGroup.add(coreMesh)
    }

    private setupMirrorMeshes(): void {
        const mirrorGeometry = this.geometryProvider.getPlaneGeometry()

        for(let face of this.cubie.faces) {
            const mirrorMesh = new THREE.Mesh(mirrorGeometry, this.stickerProvider.getStickerMaterial(face, true))
            this.positionMirrorMesh(mirrorMesh, face.normal)
            this.meshGroup.add(mirrorMesh)
        }
    }

    private positionMirrorMesh(mesh: THREE.Mesh, normal: Vector): void {
        const hoverDistance = this.size / 2 + Math.max(this.size / 4, this.dimension * this.size/ 24)
        mesh.position.set(normal.x * hoverDistance, normal.y * hoverDistance, normal.z * hoverDistance)

        const targetNormal = new THREE.Vector3(-normal.x, -normal.y, -normal.z)
        const defaultNormal = new THREE.Vector3(0, 0, 1)
        mesh.quaternion.setFromUnitVectors(defaultNormal, targetNormal)
    }

    private getMaterial(): Array<THREE.MeshBasicMaterial> {
        // Default to Background Color
        let material = Array(6).fill(this.stickerProvider.getStickerMaterial())
        // Draw Stickers only on visible Faces
        for(let face of this.cubie.faces)
            material[face.side.index()] = this.stickerProvider.getStickerMaterial(face)
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
