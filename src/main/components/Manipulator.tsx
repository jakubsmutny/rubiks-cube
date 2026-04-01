import {CubeModel} from "../model/CubeModel";
import styles from "./Manipulator.module.css";

interface Props {
    cubeModel: CubeModel
}

export default function Manipulator({ cubeModel }: Props) {

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
                    onClick={() => cubeModel.scramble()}
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
