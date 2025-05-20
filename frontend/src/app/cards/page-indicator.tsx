import styles from "./cards.module.css";

export type PageIndicatorProps = {
    numPages: number,
    currentPage: number,
};

export default function PageIndicator(props: PageIndicatorProps) {
    const dots = Array(props.numPages).fill(0).map((_, i) => {
        const className = i == props.currentPage ? `${styles.dot} ${styles.current}` : styles.dot;
        return (
            <div className={className} key={i}></div>
        )
    });

    return (
        <div className={styles["page-indicator-container"]}>
            {...dots}
        </div>
    )
}
