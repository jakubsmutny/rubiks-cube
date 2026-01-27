import {CubeModel} from "../model/CubeModel";
import styles from "./Manipulator.module.css";
import {ShuffleFactory} from "../model/factories/ShuffleFactory";

interface Props {
    cubeModel: CubeModel
}

export default function Manipulator({ cubeModel }: Props) {

    const onRandomShuffle = () => {
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(cubeModel.dimension)
        cubeModel.manipulate(shuffleFactory.createRandom(30))
    }

    return (
        <div className={styles.manipulator}>
            <span className={styles.title}>Manipulations</span>
            <div className={styles.manipulatorButtons}>
                <button
                    onClick={() => cubeModel.solve()}
                >
                    Solve
                </button>
                <button
                    onClick={onRandomShuffle}
                >
                    Scramble
                </button>
                <button
                    onClick={() => cubeModel.undo()}
                >
                    Undo
                </button>
                <button
                    onClick={() => cubeModel.redo()}
                >
                    Redo
                </button>
            </div>
        </div>
    );
}