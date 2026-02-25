import {Cubie} from "../model/Cubie";
import {SceneView} from "./SceneView";
import * as THREE from "three";
import {MaterialProvider} from "./utility/MaterialProvider";
import {GeometryProvider} from "./utility/GeometryProvider";
import {Vector} from "../model/geometry/Vector";

export class CubieView {

    cubie: Cubie
    dimension: number

    size: number
    offset: number
    meshGroup: THREE.Group

    stickerProvider: MaterialProvider
    geometryProvider: GeometryProvider

    constructor(cubie: Cubie, dimension: number, stickerProvider: MaterialProvider, geometryProvider: GeometryProvider) {
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
        const coreGeometry = this.geometryProvider.getFaceGeometry()

        for(let face of this.cubie.faces) {
            const mirrorMesh = new THREE.Mesh(coreGeometry, this.stickerProvider.getStickerMaterial(face))
            mirrorMesh.userData.cubieModel = this.cubie
            mirrorMesh.userData.draggable = true
            this.positionCoreMesh(mirrorMesh, face.normal)
            this.meshGroup.add(mirrorMesh)
        }
    }

    private setupMirrorMeshes(): void {
        const mirrorGeometry = this.geometryProvider.getFaceGeometry()

        for(let face of this.cubie.faces) {
            const mirrorMesh = new THREE.Mesh(mirrorGeometry, this.stickerProvider.getStickerMaterial(face, true))
            mirrorMesh.userData.cubieModel = this.cubie
            mirrorMesh.userData.draggable = false
            this.positionMirrorMesh(mirrorMesh, face.normal)
            this.meshGroup.add(mirrorMesh)
        }
    }

    private positionCoreMesh(mesh: THREE.Mesh, normal: Vector): void {
        const hoverDistance = this.size / 2
        mesh.position.set(normal.x * hoverDistance, normal.y * hoverDistance, normal.z * hoverDistance)

        const targetNormal = new THREE.Vector3(normal.x, normal.y, normal.z)
        const defaultNormal = new THREE.Vector3(0, 0, 1)
        mesh.quaternion.setFromUnitVectors(defaultNormal, targetNormal)
    }

    private positionMirrorMesh(mesh: THREE.Mesh, normal: Vector): void {
        const hoverDistance = this.size / 2 + Math.max(this.size / 4, this.dimension * this.size/ 24)
        mesh.position.set(normal.x * hoverDistance, normal.y * hoverDistance, normal.z * hoverDistance)

        const targetNormal = new THREE.Vector3(-normal.x, -normal.y, -normal.z)
        const defaultNormal = new THREE.Vector3(0, 0, 1)
        mesh.quaternion.setFromUnitVectors(defaultNormal, targetNormal)
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
