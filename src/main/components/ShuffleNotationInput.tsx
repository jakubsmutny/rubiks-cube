import styles from './ShuffleNotationInput.module.css'
import React, {FormEvent, useState} from "react";
import {ShuffleFactory} from "../model/factories/ShuffleFactory";
import {CubeModel} from "../model/CubeModel";

interface Props {
    cubeModel: CubeModel
}

export default function ShuffleNotationInput({ cubeModel }: Props) {

    const [inputValue, setInputValue] = useState("")

    const onShuffleInput = (event?: FormEvent) => {
        if(event) event.preventDefault()
        if(inputValue.trim() === "") return
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(cubeModel.dimension)
        cubeModel.manipulate(shuffleFactory.createFromNotation(inputValue))
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