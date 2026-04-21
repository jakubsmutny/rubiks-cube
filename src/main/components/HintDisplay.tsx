import styles from "./HintDisplay.module.css"

export default function HintDisplay() {

    return (
        <div className={styles.hintDisplay}>
            <h1>Corner placement</h1>
            <p>Do this:</p>
            <code>R U R' U'</code>
        </div>
    );
}
