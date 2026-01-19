import styles from './CubeCanvas.module.css';
import {useEffect, useRef} from 'react';
import {CubeModel} from "../model/CubeModel";
import {SceneView} from "../view/SceneView";

interface Props {
    cubeModel: CubeModel
}

export default function CubeCanvas({ cubeModel }: Props) {

    const sceneViewRef = useRef<SceneView | null>(null);

    useEffect(() => {
        if (!sceneViewRef.current) {
            sceneViewRef.current = new SceneView(cubeModel, 'cubeCanvas');
}
        return () => {
            if(sceneViewRef.current) {
                sceneViewRef.current.renderer.setAnimationLoop(null)
                sceneViewRef.current.renderer.dispose()
                sceneViewRef.current.sceneController.removeEventListeners()
                sceneViewRef.current = null
            }
        }
    }, [cubeModel])

    useEffect(() => {
        if(sceneViewRef.current) {
            sceneViewRef.current.setCubeModel(cubeModel);
        }
    }, [cubeModel])
    
    return (
        <canvas
            id='cubeCanvas'
            className={styles.cubeCanvas}
        />
    );
}
