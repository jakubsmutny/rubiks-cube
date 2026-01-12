import React, { useRef, useEffect } from 'react';

import DimensionSelector from './components/DimensionSelector';
import CubeCanvas from './components/CubeCanvas';

export default function App() {

const viewRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <div>
                <input
                    type="text"
                    id="shuffle"
                    placeholder="Enter shuffle notation"
                />
                <button id="shuffleButton">Apply</button>
            </div>
            <DimensionSelector />
            <CubeCanvas />
        </>
    );
}
