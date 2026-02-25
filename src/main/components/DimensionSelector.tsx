import styles from './DimensionSelector.module.css';

interface Props {
    currentDimension: number
    onDimensionChange: (dim: number) => void
}

export default function DimensionSelector({ currentDimension, onDimensionChange }: Props) {
    const min = 2
    const max = 100

    return (
        <div className={styles.dimensionSelector}>
            <label htmlFor="dimensionSelector">Dimension</label>
            <select
                value={currentDimension}
                onChange={(e) => onDimensionChange(Number(e.target.value))}
            >
                {Array.from({ length: max - min + 1 }, (_, i) => {
                    const dim: number = min + i;
                    return (
                        <option key={dim} value={dim}>
                            {dim}x{dim}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
