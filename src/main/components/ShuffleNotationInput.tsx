import styles from './ShuffleNotationInput.module.css'
import React from "react";

export default function ShuffleNotationInput() {
    return (
        <div className={styles.shuffleNotationInput}>
            <input
                type="text"
                id="shuffle"
                placeholder="Enter shuffle notation"
            />
            <button id="shuffleButton">Apply</button>
        </div>
    );
}