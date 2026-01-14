import React, {useState} from 'react';

import DimensionSelector from './DimensionSelector';
import CubeCanvas from './CubeCanvas';
import ShuffleNotationInput from "./ShuffleNotationInput";
import {CubeModel} from "../model/CubeModel";

export default function App() {

    const [cubeModel, setCubeModel] = useState(new CubeModel(3));

    const handleDimensionChange = (dim: number) => {
        setCubeModel(new CubeModel(dim));
    }

    return (
        <>
            <DimensionSelector
                currentDimension={cubeModel.dimension}
                onDimensionChange={handleDimensionChange}
            />
            <ShuffleNotationInput />
            <CubeCanvas
                cubeModel={cubeModel}
            />
        </>
    );
}
