import styles from './CubeCanvas.module.css';
import { useEffect } from 'react';
import { SceneEngine } from '../cube/SceneEngine';

export default function CubeCanvas() {
    
    useEffect(() => {
        const engine = new SceneEngine(2, 3, 5, 'mainCubeCanvas');
    }, []);
    
    return (
        <canvas
            id="mainCubeCanvas"
            className={styles.cubeCanvas}
        />
    );
}
