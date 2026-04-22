import styles from "./HintDisplay.module.css"
import React, {useEffect, useState} from "react"
import {CubeModel} from "../model/CubeModel"
import {CameraMoveTranslator} from "../controller/CameraMoveTranslator"
import {ShuffleFactory} from "../model/factories/ShuffleFactory"
import {Displayable} from "../model/display/Displayable"
import {Observer} from "../model/utility/observer/Observer"

interface Props {
    cubeModel: CubeModel
    moveTranslator: CameraMoveTranslator | null
}

export default function HintDisplay({ cubeModel, moveTranslator }: Props) {
    const [, setTick] = useState(0)
    useEffect(() => {
        const observer: Observer = {
            updateMethodStep: () => {
                setTick(t => t + 1)
            },
            updateMove: () => {}
        }
        cubeModel.register(observer)
    }, [cubeModel])

    const manipulate = (e: React.MouseEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText;
        if(text.trim() === "") return
        const shuffleFactory: ShuffleFactory = new ShuffleFactory(cubeModel.dimension)
        let shuffle = shuffleFactory.createFromNotation(text)
        if(moveTranslator) shuffle = moveTranslator.translateShuffle(shuffle)
        cubeModel.manipulate(shuffle)
    }

    return (
        <div className={styles.hintDisplay}>
            <div className={styles.content}>
                {cubeModel.method.getHint().map((hint: Displayable, index: number) => {
                    const key = `${hint.getType()}-${index}`
                    switch(hint.getType()) {
                        case 'heading': return <h1 key={key}>{hint.getContents()}</h1>
                        case 'text': return <p key={key}>{hint.getContents()}</p>
                        case 'notation': return <code key={key} onClick={manipulate}>{hint.getContents()}</code>
                        default: return null
                    }
                })}
            </div>
        </div>
    );
}
