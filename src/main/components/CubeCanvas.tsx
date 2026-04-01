import styles from './CubeCanvas.module.css';
import {useEffect, useRef} from 'react';
import {CubeModel} from "../model/CubeModel";
import {SceneView} from "../view/SceneView";

interface Props {
    cubeModel: CubeModel
}

export default function CubeCanvas({ cubeModel }: Props) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneViewRef = useRef<SceneView | null>(null)

    useEffect(() => {
        if(!canvasRef.current) return

        if(sceneViewRef.current) sceneViewRef.current.setCubeModel(cubeModel)
        else sceneViewRef.current = new SceneView(cubeModel, canvasRef.current)

        return () => {
            if(sceneViewRef.current) {
                sceneViewRef.current.renderer.setAnimationLoop(null)
                sceneViewRef.current.dispose()
                sceneViewRef.current = null
            }
        }
    }, [cubeModel])

    return (
        <canvas
            ref={canvasRef}
            className={styles.cubeCanvas}
        />
    );
}
