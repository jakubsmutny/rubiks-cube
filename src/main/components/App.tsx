import React, {useState} from 'react'
import styles from './App.module.css'
import DimensionSelector from './DimensionSelector'
import CubeCanvas from './CubeCanvas'
import ShuffleNotationInput from "./ShuffleNotationInput"
import {CubeModel} from "../model/CubeModel"
import Manipulator from "./Manipulator"

export default function App() {

    const [cubeModel, setCubeModel] = useState(new CubeModel(3));

    const handleDimensionChange = (dim: number) => {
        setCubeModel(new CubeModel(dim));
    }

    return (
        <>
            <div className={styles.controlsContainer}>
                <DimensionSelector
                    currentDimension={cubeModel.dimension}
                    onDimensionChange={handleDimensionChange}
                />
                <Manipulator
                    cubeModel={cubeModel}
                />
            </div>
            <ShuffleNotationInput
                cubeModel={cubeModel}
            />
            <CubeCanvas
                cubeModel={cubeModel}
            />
        </>
    );
}
