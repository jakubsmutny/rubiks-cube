import {Cubie} from "../Cubie"
import {CubePosition} from "../utility/CubePosition"
import {Face} from "../Face"
import {FaceFactory} from "./FaceFactory"

export class CubieFactory {

    static createCubies(dimension: number): Array<Cubie> {
        let cubies: Cubie[] = Array<Cubie>()

        for (let i: number = 0; i < dimension; i++) {
            for (let j: number = 0; j < dimension; j++) {
                for (let k: number = 0; k < dimension; k++) {

                    let position: CubePosition = new CubePosition(i, j, k)
                    let faces: Array<Face> = FaceFactory.createFaces(position, dimension)

                    if(faces.length === 0) {
                        continue
                    }

                    let cubie: Cubie = new Cubie(position, faces)
                    cubies.push(cubie)
                }
            }
        }
        return cubies;
    }
}
