import styles from './ShuffleNotationInput.module.css'
import React, {FormEvent, useState} from "react";
import {ShuffleFactory} from "../model/factories/ShuffleFactory";
import {CubeModel} from "../model/CubeModel";
import {CameraMoveTranslator} from "../controller/CameraMoveTranslator";

interface Props {
    cubeModel: CubeModel
    moveTranslator: CameraMoveTranslator | null
}

export default function ShuffleNotationInput({ cubeModel, moveTranslator }: Props) {

    const [inputValue, setInputValue] = useState("")

    const onShuffleInput = (event?: FormEvent) => {
        if(event) event.preventDefault()
        if(inputValue.trim() === "") return
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(cubeModel.dimension)
        let shuffle = shuffleFactory.createFromNotation(inputValue)
        if(moveTranslator) shuffle = moveTranslator.translateShuffle(shuffle)
        cubeModel.manipulate(shuffle)
        setInputValue("")
    }

    return (
        <form
            className={styles.shuffleNotationInput}
            onSubmit={onShuffleInput}
        >
            <input
                type="text"
                placeholder="Enter shuffle notation"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                onClick={onShuffleInput}
            >
                Apply
            </button>
        </form>
    );
}