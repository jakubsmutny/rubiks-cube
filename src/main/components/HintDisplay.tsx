import styles from "./HintDisplay.module.css"
import React from "react";
import {CubeModel} from "../model/CubeModel";
import {CameraMoveTranslator} from "../controller/CameraMoveTranslator";
import {ShuffleFactory} from "../model/factories/ShuffleFactory";

interface Props {
    cubeModel: CubeModel
    moveTranslator: CameraMoveTranslator | null
}

export default function HintDisplay({ cubeModel, moveTranslator }: Props) {
    const manipulate = (e: React.MouseEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText;
        if(text.trim() === "") return
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(cubeModel.dimension)
        let shuffle = shuffleFactory.createFromNotation(text)
        if(moveTranslator) shuffle = moveTranslator.translateShuffle(shuffle)
        cubeModel.manipulate(shuffle)
    };

    return (
        <div className={styles.hintDisplay}>
            <h1>Funny scrambles</h1>
            <p>Do this:</p>
            <code onClick={manipulate}>M E M' E'</code>
            <p>Also try this:</p>
            <code onClick={manipulate}>M2 E2 S2</code>
        </div>
    );
}
