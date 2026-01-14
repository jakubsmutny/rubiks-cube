import styles from './CubeCanvas.module.css';
import { useEffect } from 'react';
import {CubeModel} from "../model/CubeModel";
import {SceneView} from "../view/SceneView";

interface Props {
    cubeModel: CubeModel
}

export default function CubeCanvas({ cubeModel }: Props) {
    
    useEffect(() => {
        const sceneView = new SceneView(cubeModel, 'cubeCanvas')
        const sceneController = sceneView.getController()
    }, []);
    
    return (
        <canvas
            id='cubeCanvas'
            className={styles.cubeCanvas}
        />
    );
}
