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
                        case 'notation': return <code key={key} onClick={manipulate}>{hint.getContents()}</code>
                        case 'picture': return <img key={key} src={hint.getContents()} alt="Diagram"/>
                        case 'text': {
                            const parts = hint.getContents().split(/(\[.*?]\(.*?\))/g);
                            return (
                                <p key={key}>
                                    {parts.map((part, i) => {
                                        const match = part.match(/\[(.*?)]\((.*?)\)/);
                                        if(match) {
                                            const [, linkText, url] = match;
                                            return (
                                                <a key={i} href={url} target="_blank" rel="noreferrer">
                                                    {linkText}
                                                </a>
                                            );
                                        }
                                        return part;
                                    })}
                                </p>
                            );
                        }
                        default: return null
                    }
                })}
            </div>
        </div>
    );
}
